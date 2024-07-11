import Blockchain from "../classes/BlockChain";

export class BlockchainService {
  blockchainInstance = new Blockchain();
  wallet = null;

  constructor(wallet) {
    this.wallet = wallet;
    this.validators = [this.getWalletAddress()];
  }

  updateValidators(validators) {
    this.validators = [...validators, this.getWalletAddress()];
  }

  getBalanceOfAddress(address) {
    return this.blockchainInstance.getBalanceOfAddress(address);
  }

  getBlocks() {
    return this.blockchainInstance.chain;
  }

  getBlock(blockHash) {
    return this.blockchainInstance.getBlock(blockHash);
  }


  validateTransaction(tx) {
    return this.blockchainInstance.validateTransaction(tx);
  }

  addBlock(block) {
    this.blockchainInstance.addBlock(block);
  }

  getTransaction(txHash) {
    return this.blockchainInstance.getTransaction(txHash);
  }

  getPendingTransactions() {
    return this.blockchainInstance.pendingTransactions;
  }

  forgeBlock(transactions) {
    return this.blockchainInstance.forgeBlock(
      transactions,
      this.wallet.signingKeyObj.getPublic("hex"),
    );
  }

  getLaterBlock() {
    return this.blockchainInstance.getLaterBlock();
  }

  getLatestBlock() {
    return this.blockchainInstance.getLatestBlock();
  }

  getLatestBlockPosition() {
    return this.blockchainInstance.getLatestBlockPosition();
  }

  getWalletAddress() {
    return this.wallet.signingKeyObj.getPublic("hex");
  }

  chooseValidator() {
    return this.validators[Math.floor(Math.random() * this.validators.length)];
  }
}