import { MintService } from "../services/mint.service";
import Block from "./Block";
import Transaction from "./Transaction";

export default class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 5;
    this.blockTime = 30000;
  }

  static isValid(blockchain) {
    for (let i = 1; i < blockchain.chain.length; i++) {
      const currentBlock = blockchain.chain[i];
      const prevBlock = blockchain.chain[i - 1];

      if (
        currentBlock.hash !== Block.calculateHash(currentBlock) ||
        prevBlock.hash !== currentBlock.previousHash ||
        !Block.hasValidTransactions(currentBlock, blockchain)
      ) {
        return false;
      }
    }

    return true;
  }

  createGenesisBlock() {
    return new Block(Date.parse("2023-07-16"), [], "0");
  }

  getBlock(blockHash) {
    for (let i = 0; i < this.chain.length; i++) {
      if (this.chain[i].hash === blockHash) {
        return { blockHeight: i, block: this.chain[i] };
      }
    }
  }

  getLaterBlock() {
    return this.chain[this.chain.length - 2];
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  getLatestBlockPosition() {
    return this.chain.length - 1;
  }

  minePendingTransactions(miningRewardAddress) {
    const rewardTx = new Transaction(
      MintService.MINT_PUBLIC_ADDRESS,
      miningRewardAddress,
      this.miningReward,
    );

    rewardTx.signTransaction(MintService.MINT_KEY_PAIR);
    this.pendingTransactions.push(rewardTx);

    const block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash,
    );

    this.addBlock(block);
    this.pendingTransactions = [];
  }

  addBlock(block) {
    block.mineBlock(this.difficulty);
    this.chain.push(block);

    this.difficulty += Date.now() - parseInt(this.getLatestBlock().timestamp) < this.blockTime? 1 : -1;
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transaction must include from and to address");
    }

    if (!transaction.isValid()) {
      throw new Error("Cannot add invalid transaction to chain");
    }

    if (transaction.amount <= 0) {
      throw new Error("Transaction amount should be higher than 0");
    }

    const walletBalance = this.getBalanceOfAddress(transaction.fromAddress);

    if (transaction.fromAddress !== MintService.MINT_PUBLIC_ADDRESS) {
      if (walletBalance < transaction.amount) {
        throw new Error("Not enough balance");
      }

     const pendingTxForWallet = this.pendingTransactions.filter(
        tx => tx.fromAddress === transaction.fromAddress,
      );

      if (pendingTxForWallet.length > 0) {
        const totalPendingAmount = pendingTxForWallet
          .map(tx => tx.amount)
          .reduce((prev, curr) => prev + curr);

          const totalAmount = totalPendingAmount + transaction.amount;
          if (totalAmount > walletBalance) {
            throw new Error(
              "Pending transactions for this wallet is higher than its balance.",
            );
          }
      }
    
      this.pendingTransactions.push(transaction);
    } 
    else {
      this.pendingTransactions.push(transaction);
    }
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  getAllTransactionsForWallet(address) {
    const txs = [];

    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.fromAddress === address || tx.toAddress === address) {
          txs.push(tx);
        }
      }
    }

    return txs;
  }

  getTransaction(txHash) {
    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.hash === txHash) {
          return tx;
        }
      }
    }
  }

  isChainValid() {
    const realGenesis = JSON.stringify(this.createGenesisBlock());

    if (realGenesis !== JSON.stringify(this.chain[0])) {
      return false;
    }

    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (previousBlock.hash !== currentBlock.previousHash) {
        return false;
      }

      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
    }

    return true;
  }
}