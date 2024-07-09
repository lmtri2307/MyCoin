import { Box, Snackbar, Stack, Typography, Alert } from "@mui/material";
import ContainedButton from "../../../buttons/ContainedButton";
import ModalInput from "../../../input/Input";
import { useState, useContext } from "react";
import { WalletService } from "../../../../services/wallet.service";
import { MainContext } from "../../../../contexts/MainContext";

export default function AccessWalletUsingPrivateKey() {
  const [privateKey, setPrivateKey] = useState("");
  const { handleSetWallet } = useContext(MainContext)
  const [showError, setShowError] = useState(false);

  const handleOnChangePrivateKey = e => {
    setPrivateKey(e.target.value);
  };

  const handleAccessWallet = () => {
    try{
      const wallet = WalletService.fromPrivateKey(privateKey);
      handleSetWallet(wallet)
    } catch(e) {
      setShowError(true);
    }
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowError(false);
  };

  return (
    <Stack spacing={3}>
      <Typography textAlign="start" fontWeight={700}>
        Enter your private key
      </Typography>
      <Stack spacing={4}>
        <ModalInput
          onChange={handleOnChangePrivateKey}
          label="Private Key"
          type="password"
        />
      </Stack>
      <Box>
        <ContainedButton 
          onClick={handleAccessWallet}
          disabled={!privateKey}
        >
          Access Wallet
        </ContainedButton>
      </Box>
      <Snackbar
        open={showError}
        autoHideDuration={2000}
        onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Invalid private key
        </Alert>
      </Snackbar>
    </Stack>
  );
}