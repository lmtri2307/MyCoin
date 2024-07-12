import EC from "elliptic";
import crypto from "crypto";
import { MintService } from "../services/mint.service";

export default class Transaction {
  static copy(obj) {
    const result = Object.assign(new Transaction(), obj);
    return result;
  }

  static isValid(tx, chain) {
    return (
      tx.isValid() &&
      (chain.getBalanceOfAddress(tx.fromAddress) >= tx.amount ||
        tx.fromAddress === MintService.MINT_PUBLIC_ADDRESS)
    );
  }

  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = Date.now();
    this.hash = this.calculateHash();
  }


  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(this.fromAddress + this.toAddress + this.amount + this.timestamp)
      .digest("hex");
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic("hex") !== this.fromAddress) {
      throw new Error("You cannot sign transactions for other wallets!");
    }

    const sig = signingKey.sign(this.hash, "base64");

    this.signature = sig.toDER("hex");
  }

  isValid() {
    if (!this.fromAddress || !this.toAddress) {
      throw new Error("Transaction must include from and to address");
    };

    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction");
    }

    if (this.amount <= 0) {
      throw new Error("Transaction amount should be higher than 0");
    }

    const ec = new EC.ec("secp256k1");

    const keypair = ec.keyFromPublic(this.fromAddress, "hex");
    const isValidSignature = keypair.verify(this.hash, this.signature);
    if (!isValidSignature) {
      throw new Error("Invalid signature");
    }

    return true;
  }
}