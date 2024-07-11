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
  isDoneInitialSync = false;
  onDoneInitialSync = () => { };
  onProposedBlock = () => { };

  constructor(mintService, blockchainService) {
    this.blockchainService = blockchainService;
    this.mintService = mintService;
    this.peerService = new PeerService(
      (data) => this.handlePeerData(data),
      this.blockchainService
    );

    setTimeout(() => {
      this.requestChain(this.peerService.address);
    }, 2000);

    const blockchain = this.blockchainService.blockchainInstance;
    const blockchainJson = JSON.stringify(blockchain);
    const parsedBlockchain = JSON.parse(blockchainJson);
    console.log("parsedBlockchain", parsedBlockchain);
    console.log("blockchain", blockchain);
    console.log("blockchainJson", blockchainJson);
  }

  _onDoneInitialSync() {
    this.isDoneInitialSync = true;
    this.onDoneInitialSync();
  }

  isReady() {
    return this.isDoneInitialSync;
  }

  produceMessage(type, data) {
    console.log("type, data", type, data)
    return { type, data };
  }

  broadcastMessage(message) {
    this.peerService.broadcastMessage(message);
  }

  sendToAddress(address, message) {
    this.peerService.sendToAddress(address, message);
  }

  sendToPublicAddress(publicAddress, message) {
    this.peerService.sendToPublicAddress(publicAddress, message);
  }

  requestChain(address) {
    if (Object.keys(this.peerService.peers).length === 0) this._onDoneInitialSync();
    this.broadcastMessage(this.produceMessage("TYPE_REQUEST_CHAIN", address));
  }

  createTransaction(toAddress, amount) {
    const newTx = new Transaction(
      this.blockchainService.getWalletAddress(),
      toAddress,
      amount,
    );
    newTx.signTransaction(this.blockchainService.wallet.signingKeyObj);

    const validatorPublicAddress = this.blockchainService.chooseValidator();
    if(validatorPublicAddress === this.blockchainService.getWalletAddress()) {
      this.handleTransactionCreated(newTx);
      return;
    }

    const message = this.produceMessage("TYPE_TRANSACTION_CREATED", newTx);
    this.sendToPublicAddress(validatorPublicAddress, message);
    // this.blockchainService.addTransaction(tx);
  }

  hackCoin() {
    const newTx = new Transaction(
      MintService.MINT_PUBLIC_ADDRESS,
      this.blockchainService.getWalletAddress(),
      10,
    );
    newTx.signTransaction(MintService.MINT_KEY_PAIR);

    const validatorPublicAddress = this.blockchainService.chooseValidator();
    if(validatorPublicAddress === this.blockchainService.getWalletAddress()) {
      this.handleTransactionCreated(newTx);
      return;
    }

    const message = this.produceMessage("TYPE_TRANSACTION_CREATED", newTx);
    this.sendToPublicAddress(validatorPublicAddress, message);
  }

  handleTransactionCreated(transactionJson) {
    this.onProposedBlock();

    const transaction = Transaction.copy(transactionJson);
    if(!this.blockchainService.validateTransaction(transaction)) return;

    const block = this.blockchainService.forgeBlock([transaction]);
    const message = this.produceMessage("TYPE_BLOCK_CREATED", {
      block: block,
    });
    this.broadcastMessage(message);
  }

  handleSendChain({ chain }) {
    if (this.isDoneInitialSync) return;

    chain = chain.map(block => Block.fromJson(block));
    if (chain.length < this.blockchainService.blockchainInstance.lenght) return;

    const tempChain = new Blockchain();
    tempChain.chain = chain;
    if (Blockchain.isValid(tempChain)) {
      this.blockchainService.blockchainInstance.chain = chain;
    }

    this._onDoneInitialSync();
  }

  handleRequestChain(address) {
    const message = this.produceMessage("TYPE_SEND_CHAIN", {
      chain: this.blockchainService.blockchainInstance.chain,
    });
    this.sendToAddress(address, message);
  }

  handleBlockCreated(messageData) {
    const { block: blockJson } = messageData;
    const block = Block.fromJson(blockJson);
    this.blockchainService.addBlock(block);
  }

  handlePeerData(data) {
    const message = JSON.parse(data);
    console.log("recive data", message.type)
    switch (message.type) {
      case "TYPE_REQUEST_CHAIN":
        this.handleRequestChain(message.data);
        break;
      case "TYPE_SEND_CHAIN":
        this.handleSendChain(message.data);
        break;
      case "TYPE_TRANSACTION_CREATED":
        this.handleTransactionCreated(message.data);
        break;
      case "TYPE_BLOCK_CREATED":
        this.handleBlockCreated(message.data);
        break;
      default:
        break;
    }
  }
}