import { Alert, Box, Snackbar, Stack } from "@mui/material";
import { useContext, useState } from "react";
import ContainedButton from "../../../buttons/ContainedButton";
import OutlinedButton from "../../../buttons/OutlinedButton";
import ModalInput from "../../../input/Input";
import ModalStepHeader from "../../ModalStepHeader";
import { AccessWalletUsingKeystoreContext } from "../../../../contexts/AccessWalletUsingKeystoreContext";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../../../contexts/MainContext";

const wrapperStyle = {
  padding: "48px",
};

export default function EnterPasswordStep() {
  const navigate = useNavigate();
  const { handleAccessWallet } = useContext(AccessWalletUsingKeystoreContext);
  const { handleSetWallet } = useContext(MainContext);
  const [password, setPassword] = useState();
  const [isLoading, setIsLoading] = useState();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChangePassword = e => {
    setPassword(e.target.value);
  };

  const handleClickAccessWalletButton = async () => {
    setIsLoading(true);
    const wallet = await handleAccessWallet(password);

    if (wallet) {
      handleSetWallet(wallet);
      navigate("/wallet/dashboard/main");
    } 
    else {
      setIsLoading(false);
      setOpenSnackbar(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };


  return (
    <Stack spacing={3} sx={wrapperStyle}>
      <ModalStepHeader
        headline="STEP 2."
        title="Enter password"
        description="Enter your password to unlock your wallet."
      />
      <Stack spacing={4}>
        <ModalInput
          onChange={handleChangePassword}
          label="Password"
          type="password"/>
      </Stack>
      <Box>
        <OutlinedButton
          style={{
            marginRight: "15px",
          }}
          loading={isLoading}>
          Back
        </OutlinedButton>
        
        <ContainedButton
          onClick={handleClickAccessWalletButton}
          loading={isLoading}
          disabled={!password || password.length < 8}>
          Access Wallet
        </ContainedButton>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Key derivation failed - possibly wrong passphrase
        </Alert>
      </Snackbar>
    </Stack>
  );
}