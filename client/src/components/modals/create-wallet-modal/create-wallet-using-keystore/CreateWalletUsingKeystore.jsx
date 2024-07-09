import Wallet from "ethereumjs-wallet";
import EC from "elliptic";
import ModalStepper from "../../ModalStepper";
import CreateWalletWellDoneStep from "../CreateWalletWellDoneStep";
import CreatePasswordStep from "./CreatePasswordStep";
import DownloadKeystoreFileStep from "./DownloadKeystoreFileStep";
import { CreateWalletUsingKeystoreContext } from "../../../../contexts/CreateWalletUsingKeystoreContext";
import { useState } from "react";
import { WalletService } from "../../../../services/wallet.service";

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
  const [privateKey, setPrivateKey] = useState();

  const handleCreatePassword = async password => {
    const {fileName, keyStore: fileContent, privateKey} = await WalletService.createKeyStore(password);
    
    const data = new Blob([fileContent], { type: "text/plain" });
    const downloadUrl = window.URL.createObjectURL(data);
    setDownloadLink(downloadUrl);
    setDownloadedFile(`${fileName}.${fileName.slice(25).toUpperCase()}`);
    setPrivateKey(privateKey)
  };

  const clearState = () => {
    setDownloadLink(undefined);
    setDownloadedFile(undefined);
    setPrivateKey(undefined)
  };

  return (
    <CreateWalletUsingKeystoreContext.Provider
      value={{
        handleCreatePassword,
        file: downloadedFile,
        downloadLink,
        clearState,
        privateKey,
      }}>
      <ModalStepper steps={steps} stepComponents={stepComponents} />
    </CreateWalletUsingKeystoreContext.Provider>
  );

}