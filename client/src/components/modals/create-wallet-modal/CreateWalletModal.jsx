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

  const handleOnClickCard = queryValue => {
    setSearchParams(`createType=${queryValue}`, {
      replace: true,
    });
  };

  const handleBack = () => {
    setSearchParams("", {
      replace: true,
    });
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
                {searchParams.toString().endsWith("keystore") ? "Create Wallet with Keystore File" : "Create wallet using software"}
            </Typography>
          </ModalHeader>
          
          <ModalBody>
            {searchParams.toString().endsWith("keystore") ? (<CreateWalletUsingKeystore/>) : (
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