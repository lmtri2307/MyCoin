import Wallet from "ethereumjs-wallet";
import EC from "elliptic";
import ModalStepper from "../../ModalStepper";
import CreateWalletWellDoneStep from "../CreateWalletWellDoneStep";
import CreatePasswordStep from "./CreatePasswordStep";
import DownloadKeystoreFileStep from "./DownloadKeystoreFileStep";
import { CreateWalletUsingKeystoreContext } from "../../../../contexts/CreateWalletUsingKeystoreContext";
import { useState } from "react";

const steps = [
  "STEP 1. Create password",
  "STEP 2. Download keystore file",
  "STEP 3. Well done",
];

const stepComponents = [
  <CreatePasswordStep />,
  <DownloadKeystoreFileStep />,
  <CreateWalletWellDoneStep />,
];

export default function CreateWalletUsingKeystore() {
  const [downloadLink, setDownloadLink] = useState();
  const [downloadedFile, setDownloadedFile] = useState();

  const handleCreatePassword = async password => {
    const ec = new EC.ec("secp256k1");
    const key = ec.genKeyPair();
    const privateKeyBuffer = Buffer.from(key.getPrivate("hex"), "hex");
    const wallet = Wallet.fromPrivateKey(privateKeyBuffer);
    const fileName = wallet.getV3Filename();
    const fileContent = await wallet.toV3String(password);
    const data = new Blob([fileContent], { type: "text/plain" });
    const downloadUrl = window.URL.createObjectURL(data);
    setDownloadLink(downloadUrl);
    setDownloadedFile(`${fileName}.${fileName.slice(25).toUpperCase()}`);
  };

  return (
    <CreateWalletUsingKeystoreContext.Provider
      value={{
        handleCreatePassword,
        file: downloadedFile,
        downloadLink,
      }}>
      <ModalStepper steps={steps} stepComponents={stepComponents} />
    </CreateWalletUsingKeystoreContext.Provider>
  );

}