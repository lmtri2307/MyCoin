import crypto from "crypto";
import Transaction from "./Transaction";

export default class Block {
  static fromJson(obj) {
    const result = Object.assign(new Block(), obj);
    result.transactions = obj.transactions.map(tx => Transaction.copy(tx));
    return result;
  }

  static calculateHash(block) {
    return block.calculateHash();
  }

  static hasValidTransactions(block, chain) {
    return block.transactions.every(transaction =>
      Transaction.isValid(Transaction.copy(transaction), chain),
    );
  }

  constructor(timestamp, transactions, previousHash = "", validator) {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.validator = validator;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.validator,
      )
      .digest("hex");
  }

  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }

    return true;
  }
}