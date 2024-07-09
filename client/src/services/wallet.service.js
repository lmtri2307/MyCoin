import Wallet from "ethereumjs-wallet";
import EC from "elliptic";
const walletKey = "wallet"

const addSigningKeyObj = (wallet) => {
    const keyObj = new EC.ec("secp256k1").keyFromPrivate(
        wallet.getPrivateKey(),
    );
    wallet["signingKeyObj"] = keyObj;
    return wallet;
}
export class WalletService {
    static saveWallet = async wallet => {
        try {
            const privateKey = wallet.getPrivateKey();
            const privateKeyString = privateKey.toString("hex");
            sessionStorage.setItem(walletKey, privateKeyString);
        }
        catch (e) {
            return null;
        }
    }
    static loadWallet = async () => {
        try {
            const privateKeyString = sessionStorage.getItem(walletKey);
            if (!privateKeyString) {
                return null;
            }
            const privateKey = Buffer.from(privateKeyString, "hex");
            const wallet = Wallet.fromPrivateKey(privateKey);
            const addedKeyWallet = addSigningKeyObj(wallet);
            return addedKeyWallet;
        }
        catch (e) {
            return null;
        }
    }
    static fromKeyStore = async (keystore, password) => {
        try {
            const wallet = await Wallet.fromV3(keystore, password);
            const addedKeyWallet = addSigningKeyObj(wallet);
            return addedKeyWallet;
        }
        catch (e) {
            return null;
        }
    }
    static createKeyStore = async (password) => {
            const ec = new EC.ec("secp256k1");
            const key = ec.genKeyPair();
            const privateKey = key.getPrivate("hex");
            const privateKeyBuffer = Buffer.from(privateKey, "hex");
            const wallet = Wallet.fromPrivateKey(privateKeyBuffer);
            const fileName = wallet.getV3Filename();
            const keyStore = await wallet.toV3String(password);
            return { fileName, keyStore, privateKey };
    }
    static clearWallet = async () => {
        sessionStorage.removeItem(walletKey);
    }
}