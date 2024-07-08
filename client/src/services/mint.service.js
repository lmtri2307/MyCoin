import EC from "elliptic";

export class MintService {
  static MINT_PRIVATE_ADDRESS =
    "0700a1ad28a20e5b2a517c00242d3e25a88d84bf54dce9e1733e6096e6d6495e";
  static MINT_KEY_PAIR = new EC.ec("secp256k1").keyFromPrivate(
    this.MINT_PRIVATE_ADDRESS,
    "hex",
  );
  static MINT_PUBLIC_ADDRESS = this.MINT_KEY_PAIR.getPublic("hex");
}