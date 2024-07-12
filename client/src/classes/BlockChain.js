import { MintService } from "../services/mint.service";
import Block from "./Block";
import Transaction from "./Transaction";

export default class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
    this.miningReward = 5;
    this.blockTime = 30000;
  }

  static isValid(blockchain) {
    const tempChain = new Blockchain();
    try {
      for(let i = 1; i < blockchain.chain.length; i++) {
        tempChain.addBlock(blockchain.chain[i])
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  createGenesisBlock() {
    return new Block(Date.parse("2023-07-16"), [], "0", MintService.MINT_PUBLIC_ADDRESS);
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

  forgeBlock(transactions, validatorAddress) {
    const rewardTx = new Transaction(
      MintService.MINT_PUBLIC_ADDRESS,
      validatorAddress,
      this.miningReward,
    );
    rewardTx.signTransaction(MintService.MINT_KEY_PAIR);
    transactions.push(rewardTx);

    const block = new Block(
      Date.now(),
      transactions,
      this.getLatestBlock().hash,
      validatorAddress,
    );

    this.addBlock(block);
    return block;
  }

  addBlock(block) {
    if(!block.hasValidTransactions()) {
      throw new Error("Invalid block: transactions are not valid")
    }

    const groupedTransactions = block.transactions.reduce((acc, tx) => {
      if(tx.fromAddress === MintService.MINT_PUBLIC_ADDRESS) {
        return acc;
      }
      
      if (!acc[tx.fromAddress]) {
        acc[tx.fromAddress] = [tx];
        return acc;
      }

      acc[tx.fromAddress].push(tx);
      return acc;
    }, {});
    
    Object.keys(groupedTransactions).forEach(address => {
      const txs = groupedTransactions[address];
      const totalSpent = txs.reduce((acc, tx) => acc + tx.amount, 0);
      if (totalSpent > this.getBalanceOfAddress(address)) {
        throw new Error("Invalid block: not enough balance for transactions");
      }
    });

    if(block.previousHash !== this.getLatestBlock().hash) {
      throw new Error("Invalid block: previous hash is not valid");
    }

    this.chain.push(block);
  }

  validateTransaction(transaction) {
    if(!transaction.isValid()) {
      throw new Error("Invalid transaction");
    }

    if(transaction.fromAddress === MintService.MINT_PUBLIC_ADDRESS) {
      return true;
    }

    const walletBalance = this.getBalanceOfAddress(transaction.fromAddress);

    if (walletBalance < transaction.amount) {
      throw new Error("Not enough balance");
    }

    return true;

    // const pendingTxForWallet = this.pendingTransactions.filter(
    //   tx => tx.fromAddress === transaction.fromAddress,
    // );

    // if (pendingTxForWallet.length > 0) {
    //   const totalPendingAmount = pendingTxForWallet
    //     .map(tx => tx.amount)
    //     .reduce((prev, curr) => prev + curr);

    //     const totalAmount = totalPendingAmount + transaction.amount;
    //     if (totalAmount > walletBalance) {
    //       throw new Error(
    //         "Pending transactions for this wallet is higher than its balance.",
    //       );
    //     }
    // }
  
    // this.pendingTransactions.push(transaction);
    
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