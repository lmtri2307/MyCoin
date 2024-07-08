import EC from "elliptic";
import { MINT_PRIVATE_ADDRESS } from "../utils/constants";

export class MintService {
  static MINT_PRIVATE_ADDRESS = MINT_PRIVATE_ADDRESS;
  static MINT_KEY_PAIR = new EC.ec("secp256k1").keyFromPrivate(
    this.MINT_PRIVATE_ADDRESS,
    "hex",
  );
  static MINT_PUBLIC_ADDRESS = this.MINT_KEY_PAIR.getPublic("hex");
}