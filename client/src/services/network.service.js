import Transaction from "../classes/Transaction";
import Block from "../classes/Block";
import Blockchain from "../classes/BlockChain";
import { MintService } from "./mint.service";
import { PeerService } from "./peer.service";

// using send method for data transfer

export class NetworkService {
  mintService = null;
  blockchainService = null;
  check = [];
  checked = [];
  checking = false;
  tempChain = new Blockchain();
  peerService = new PeerService((data) => this.handlePeerData(data));
  isDoneInitialSync = false;
  onDoneInitialSync = () => { };

  constructor(mintService, blockchainService) {
    this.blockchainService = blockchainService;
    this.mintService = mintService;
    
    setTimeout(() => {
      this.requestChain(this.peerService.address);
      this.isDoneInitialSync = true;
      this.onDoneInitialSync();
    }, 2000);

    const blockchain = this.blockchainService.blockchainInstance;
    const blockchainJson = JSON.stringify(blockchain);
    const parsedBlockchain = JSON.parse(blockchainJson);
    console.log("parsedBlockchain", parsedBlockchain);
    console.log("blockchain", blockchain);
    console.log("blockchainJson", blockchainJson);
  }

  isReady() {
    return this.isDoneInitialSync;
  }

  produceMessage(type, data) {
    console.log("type, data", type, data)
    return { type, data };
  }

  sendMessage(message) {
    this.peerService.broadcastMessage(message);
  }

  requestChain(address) {
    this.sendMessage(this.produceMessage("TYPE_REQUEST_CHAIN", address));
  }

  minePendingTransactions() {
    this.blockchainService.minePendingTransactions();
    this.sendMessage(
      this.produceMessage("TYPE_BLOCK_CREATED", [
        this.blockchainService.getLatestBlock(),
        this.blockchainService.getDifficulty(),
      ]),
    );
  }

  createTransaction(tx) {
    const message = this.produceMessage("TYPE_TRANSACTION_CREATED", tx);
    this.sendMessage(message);
    this.blockchainService.addTransaction(tx);
  }


  handlePeerData(data) {
    const message = JSON.parse(data);
    console.log("recive data", message.type)
    switch (message.type) {
      case "TYPE_TRANSACTION_CREATED":
        this.createTransactionHandler(message.data);
        break;
      case "TYPE_BLOCK_CREATED":
        let [newBlock, newDiff] = message.data;
        newBlock = Block.fromJson(newBlock);
        this.replaceChainHandler(newBlock, newDiff);
        break;
      case "TYPE_REQUEST_CHECK":
        this.requestCheckHandler(message.data);
        break;
      case "TYPE_SEND_CHECK":
        if (this.checking) this.check.push(message.data);
        break;
      case "TYPE_SEND_CHAIN":
        this.handleSendChain(message.data);
        break;
      case "TYPE_REQUEST_CHAIN":
        this.handleRequestChain(message.data);
        break;
      case "TYPE_REQUEST_INFO":
        this.peerService.peers[message.data].send(
          JSON.stringify(
            this.produceMessage("TYPE_SEND_INFO", [
              this.blockchainService.getDifficulty(),
              this.blockchainService.getPendingTransactions(),
            ]),
          ),
        );
        break;
      case "TYPE_SEND_INFO":
        const [difficulty, pendingTransactions] = message.data;
        pendingTransactions.map(tx => Transaction.copy(tx));
        this.blockchainService.blockchainInstance.difficulty = difficulty;
        this.blockchainService.blockchainInstance.pendingTransactions = pendingTransactions;
        break;
    }
  }

  createTransactionHandler(transactionJson) {
    const transaction = Transaction.copy(transactionJson);
    this.blockchainService.addTransaction(transaction);
  }

  requestCheckHandler(address) {
    this.peerService.peers[address].send(
      JSON.stringify(
        this.produceMessage(
          "TYPE_SEND_CHECK",
          JSON.stringify([
            this.blockchainService.getLatestBlock(),
            this.blockchainService.getPendingTransactions(),
            this.blockchainService.getDifficulty(),
          ]),
        ),
      ),
    );
  }

  handleSendChain({ chain }) {
    chain = chain.map(block => Block.fromJson(block));
    const tempChain = new Blockchain();
    tempChain.chain = chain;
    if (Blockchain.isValid(tempChain)) {
      this.blockchainService.blockchainInstance.chain = chain;
    }
  }

  handleRequestChain(address) {
    const peer = this.peerService.peers[address];
    const chain = this.blockchainService.blockchainInstance.chain;
    peer.send(
      JSON.stringify(
        this.produceMessage("TYPE_SEND_CHAIN", {
          chain,
        }),
      ),
    );
  }

  replaceChainHandler(newBlock, newDiff) {
    const ourTx = [...this.blockchainService.getPendingTransactions()];

    const theirTx = [
      ...newBlock.transactions
        .filter(tx => tx.fromAddress !== MintService.MINT_PUBLIC_ADDRESS)
        .map(tx => Transaction.copy(tx)),
    ];

    const strOurTx = [];
    const strTheirTx = [];

    for (let i = 0; i < ourTx.length; i++) {
      strOurTx.push(JSON.stringify(ourTx[i]));
    }

    for (let i = 0; i < theirTx.length; i++) {
      strTheirTx.push(JSON.stringify(theirTx[i]));
    }

    const n = strTheirTx.length;

    if (
      newBlock.previousHash !==
      this.blockchainService.getLatestBlock().previousHash
    ) {
      for (let i = 0; i < n; i++) {
        const index = strOurTx.indexOf(strTheirTx[0]);

        if (index === -1) break;

        strOurTx.splice(index, 1);
        strTheirTx.splice(0, 1);
      }

      if (
        strTheirTx.length === 0 &&
        Block.calculateHash(newBlock) === newBlock.hash &&
        newBlock.hash.startsWith(
          Array(this.blockchainService.getDifficulty() + 1).join("0"),
        ) &&
        Block.hasValidTransactions(
          newBlock,
          this.blockchainService.blockchainInstance,
        ) &&
        parseInt(newBlock.timestamp) >
        parseInt(this.blockchainService.getLatestBlock().timestamp) &&
        parseInt(newBlock.timestamp) < Date.now() &&
        this.blockchainService.getLatestBlock().hash === newBlock.previousHash &&
        (newDiff + 1 === this.blockchainService.getDifficulty() ||
          newDiff - 1 === this.blockchainService.getDifficulty())
      ) {
        this.blockchainService.addBlock(newBlock);
        this.blockchainService.blockchainInstance.difficulty = newDiff;
        this.blockchainService.blockchainInstance.pendingTransactions = [
          ...strOurTx.map(tx => JSON.parse(tx)),
        ];
      }
    } else if (
      !this.checked.includes(
        JSON.stringify([
          newBlock.previousHash,
          this.blockchainService.getLaterBlock().timestamp || "",
        ]),
      )
    ) {
      this.checked.push(
        JSON.stringify([
          this.blockchainService.getLatestBlock().previousHash,
          this.blockchainService.getLaterBlock().timestamp || "",
        ]),
      );

      const position = this.blockchainService.getLatestBlockPosition();

      this.checking = true;

      this.sendMessage(this.produceMessage("TYPE_REQUEST_CHECK", this.address));

      setTimeout(() => {
        this.checking = false;

        let mostAppeared = this.check[0];

        this.check.forEach(group => {
          if (
            this.check.filter(_group => _group === group).length >
            this.check.filter(_group => _group === mostAppeared).length
          ) {
            mostAppeared = group;
          }
        });

        const group = JSON.parse(mostAppeared);

        this.blockchainService.blockchainInstance.chain[position] = group[0];
        this.blockchainService.blockchainInstance.pendingTransactions = [
          ...group[1],
        ];
        this.blockchainService.blockchainInstance.difficulty = group[2];

        this.check.splice(0, this.check.length);
      }, 5000);
    }
  }
}