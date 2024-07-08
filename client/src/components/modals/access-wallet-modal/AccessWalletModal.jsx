import { Modal, Paper, Stack, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import ModalHeader from "../ModalHeader";
import ModalPaper from "../ModalPaper";
import ModalBody from "../ModalBody";
import ModalSelectionCard from "../ModalSelectionCard";
import AccessWalletUsingKeystore from "./access-wallet-using-keystore/AccessWalletUsingKeystore";
import ModalCloseButton from "../ModalCloseButton";
import ModalBackButton from "../ModalBackButton";
import AccessWalletUsingPrivateKey from "./access-wallet-using-private-key/AccessWalletUsingPrivateKey";

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

const accessMethods = [
  {
    name: "keystore",
    imagePath: "/images/access-wallet/icon-keystore.svg",
    imageAlt: "icon-keystore",
    title: "Keystore",
  },
  {
    name: "private-key",
    imagePath: "/images/access-wallet/icon-private-key.png",
    imageAlt: "icon-private-key",
    title: "Private Key",
  },
];

export default function AccessWalletModal({ open, handleClose }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleOnClickCard = queryValue => {
    setSearchParams(`accessType=${queryValue}`, {
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
      aria-labelledby="access-wallet-modal-title"
      aria-describedby="access-wallet-modal-description"
    >
      <Paper sx={wrapperStyle}>
        <ModalPaper>
          <ModalHeader>
            <Typography
              id="access-wallet-modal-title"
              variant="h4"
              fontWeight={700}
            >
              {searchParams.toString().endsWith("keystore")
                ? "Access Wallet with Keystore File"
                : searchParams.toString().endsWith("private-key")
                ? "Access Wallet with Private Key"
                : "Select Software Wallet"}
            </Typography>
          </ModalHeader>
          <ModalBody>
            {searchParams.toString().endsWith("keystore") ? (
              <AccessWalletUsingKeystore />
            ) : searchParams.toString().endsWith("private-key") ? (
              <AccessWalletUsingPrivateKey />
            ) : (
              <Stack spacing={2.5}>
                {accessMethods.map(method => (
                  <ModalSelectionCard
                    key={method.title}
                    onClick={() => handleOnClickCard(method.name)}
                    imagePath={method.imagePath}
                    imageAlt={method.imageAlt}
                    title={method.title}
                  />
                ))}
              </Stack>
            )}
          </ModalBody>
        </ModalPaper>
        <ModalCloseButton handleClose={handleClose} />
        {searchParams.toString() !== "" && (
          <ModalBackButton handleBack={handleBack} />
        )}
      </Paper>
    </Modal>
  );
}