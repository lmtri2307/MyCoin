import { Modal, Paper, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import ModalHeader from "../ModalHeader";
import ModalPaper from "../ModalPaper";
import ModalBody from "../ModalBody";
import ModalSelectionCard from "../ModalSelectionCard";
import CreateWalletUsingKeystore from "./create-wallet-using-keystore/CreateWalletUsingKeystore";
import ModalCloseButton from "../ModalCloseButton";
import ModalBackButton from "../ModalBackButton";

const wrapperStyle = {
  position: "relative",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f2fafa",
  borderRadius: 0,
  boxShadow: "none",
};

export default function CreateWalletModal({ open, handleClose }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const isChoseKeyStore = searchParams.get("createType") === "keystore";

  const handleOnClickCard = queryValue => {
    setSearchParams(prev => {
      prev.set("createType", queryValue);
      return prev;
    })
  };

  const handleBack = () => {
    const backToChoseCreatType = () => {
      setSearchParams(prev => {
        prev.delete("createType");
        return prev;
      });
    }
    const backToHome = () => {
      handleClose();
    }
    const isChosenCreateType = searchParams.get("createType");
    if(isChosenCreateType) {
      backToChoseCreatType();
      return;
    }
    backToHome();
  };


  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="create-wallet-modal-title"
      aria-describedby="create-wallet-modal-description"
    >
      <Paper sx={wrapperStyle}>
        <ModalPaper>
          <ModalHeader>
            
            <Typography
              id="create-wallet-modal-title"
              variant="h4"
              fontWeight={700}>
                {isChoseKeyStore ? "Create Wallet with Keystore File" : "Create wallet using software"}
            </Typography>
          </ModalHeader>
          
          <ModalBody>
            {isChoseKeyStore ? (<CreateWalletUsingKeystore/>) : (
            <ModalSelectionCard
                onClick={() => handleOnClickCard("keystore")}
                imagePath="/images/create-wallet/icon-keystore-file.svg"
                imageAlt="icon-keystore"
                title="Keystore file"
                description="Using a keystore file online makes your wallet more vulnerable to
            loss of funds. We don't recommend this method of wallet creation."/>)}
          </ModalBody>

        </ModalPaper>

        <ModalCloseButton handleClose={handleClose} />
        {searchParams.toString() !== "" && (
        <ModalBackButton handleBack={handleBack} />)}
      </Paper>
    </Modal>
  );
}