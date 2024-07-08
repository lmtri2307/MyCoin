import socketIoClient from "socket.io-client";
import Peer from "simple-peer";
import Transaction from "../classes/Transaction";
import Block from "../classes/Block";
import Blockchain from "../classes/BlockChain";
import { MintService } from "./mint.service";

// using send method for data transfer

export class NetworkService {
  peers = {};
  ws = null;
  address = "";
  mintService = null;
  blockchainService = null;
  check = [];
  checked = [];
  checking = false;
  tempChain = new Blockchain();

  constructor(mintService, blockchainService) {
    this.blockchainService = blockchainService;
    this.mintService = mintService;
    this.ws = socketIoClient(process.env.REACT_APP_API);

    this.ws.on("me", id => {
      this.address = id;

      this.ws.emit("open", id);
    });

    this.ws.on("welcome", address => this.welcome(address));

    this.ws.on("openedSockets", socketAddresses => {
      socketAddresses.forEach(address => this.handshake(address));

      if (socketAddresses.length === 0) {
        const transaction = new Transaction(
          MintService.MINT_PUBLIC_ADDRESS,
          this.blockchainService.getWalletAddress(),
          10,
        );

        transaction.signTransaction(MintService.MINT_KEY_PAIR);
        this.blockchainService.addTransaction(transaction);
      }

      setTimeout(() => {
        const message = this.produceMessage("TYPE_REQUEST_CHAIN", this.address);
        this.sendMessage(message);
      }, 2000);

      setTimeout(() => {
        const message = this.produceMessage("TYPE_REQUEST_INFO", this.address);
        this.sendMessage(message);
      }, 3000);

    });

    this.ws.on("receiveSignal", ({ from, data }) => {
      this.peers[from].signal(data);
    });

    this.ws.on("peerClosed", address => {
      delete this.peers[address];
    });
  }

  produceMessage(type, data) {
    return { type, data };
  }

  sendMessage(message) {
    for (const address in this.peers) {
      this.peers[address].send(JSON.stringify(message));
    }
  }

  createPeer(address, initiator) {
    const peer = new Peer({ initiator: initiator });

    peer.on("signal", data => {
      this.ws.emit("sendSignal", {
        from: this.address,
        to: address,
        data,
      });
    });

    peer.on("data", data => {
      this.handlePeerData(data);
    });

    peer.on("close", () => {});

    this.peers[address] = peer;
  }

  welcome(address) {
    this.createPeer(address, true);
  }

  handshake(address) {
    this.createPeer(address, false);
  }

  minePendingTransactions() {
    this.blockchainService.minePendingTransactions();
    this.sendMessage(
      this.produceMessage("TYPE_REPLACE_CHAIN", [
        this.blockchainService.getLatestBlock(),
        this.blockchainService.getDifficulty(),
      ]),
    );
  }

  createTransaction(tx) {
    const message = this.produceMessage("TYPE_CREATE_TRANSACTION", tx);
    this.sendMessage(message);
    this.blockchainService.addTransaction(tx);
  }


  handlePeerData(data) {
    const message = JSON.parse(data);

    switch (message.type) {
      case "TYPE_CREATE_TRANSACTION":
        this.createTransactionHandler(message.data);
        break;
      case "TYPE_REPLACE_CHAIN":
        let [newBlock, newDiff] = message.data;
        newBlock = Block.copy(newBlock);
        this.replaceChainHandler(newBlock, newDiff);
        break;
      case "TYPE_REQUEST_CHECK":
        this.requestCheckHandler(message.data);
        break;
      case "TYPE_SEND_CHECK":
        if (this.checking) this.check.push(message.data);
        break;
      case "TYPE_SEND_CHAIN":
        let { block, finished } = message.data;
        block = Block.copy(block);
        this.sendChainHandler(block, finished);
        break;
      case "TYPE_REQUEST_CHAIN":
        this.requestChainHandler(message.data);
        break;
      case "TYPE_REQUEST_INFO":
        this.peers[message.data].send(
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

  createTransactionHandler(messageData) {
    const transaction = Transaction.copy(messageData);
    this.blockchainService.addTransaction(transaction);
  }

  requestCheckHandler(messageData) {
    this.peers[messageData].send(
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

  sendChainHandler(block, finished) {
    if (!finished) {
      this.tempChain.chain.push(block);
    } else {
      this.tempChain.chain.push(block);

      if (Blockchain.isValid(this.tempChain)) {
        this.blockchainService.blockchainInstance.chain = this.tempChain.chain;
      }

      this.tempChain = new Blockchain();
      
    }
  }

  requestChainHandler(messageData) {
    const peer = this.peers[messageData];

    for (
      let i = 1;
      i < this.blockchainService.blockchainInstance.chain.length;
      i++
    ) {
      peer.send(
        JSON.stringify(
          this.produceMessage("TYPE_SEND_CHAIN", {
            block: this.blockchainService.blockchainInstance.chain[i],
            finished: i === this.blockchainService.getLatestBlockPosition(),
          }),
        ),
      );
    }
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