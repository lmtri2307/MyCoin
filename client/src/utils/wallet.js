import Wallet from "ethereumjs-wallet";
import EC from "elliptic";
const walletKey = "wallet"

export const saveWallet = async wallet => {
    try {
        const privateKey = wallet.getPrivateKey();
        const privateKeyString = privateKey.toString("hex");
        sessionStorage.setItem(walletKey, privateKeyString);
    }
    catch (e) {
        return null;
    }
};

export const loadWallet = async () => {
    try {
        const privateKeyString = sessionStorage.getItem(walletKey);
        if (!privateKeyString) {
            return null;
        }
        const privateKey = Buffer.from(privateKeyString, "hex");
        const wallet = Wallet.fromPrivateKey(privateKey);
        const keyObj = new EC.ec("secp256k1").keyFromPrivate(
            wallet.getPrivateKey(),
          );
        wallet["signingKeyObj"] = keyObj;
        return wallet;
    }
    catch (e) {
        return null;
    }
}