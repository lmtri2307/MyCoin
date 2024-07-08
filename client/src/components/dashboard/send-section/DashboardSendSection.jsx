import { Alert, Box, Grid, Snackbar, Stack, Typography } from "@mui/material";
import Input from "../../input/Input";
import DashboardContent from "../DashboardContent";
import Paper from "../Paper";
import ContainedButton from "../../buttons/ContainedButton";
import { useContext, useState } from "react";
import { MainContext } from "../../../contexts/MainContext";
import Transaction from "../../../classes/Transaction";

const wrapperStyle = {
  maxWidth: "736px",
};

const containerStyle = {
  padding: "32px 48px",
};

export default function DashboardSendSection() {
  const { blockchainService, networkService } = useContext(MainContext);
  const [amount, setAmount] = useState();
  const [toAddress, setToAddress] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);

  const handleCloseErrorSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenErrorSnackbar(false);
  };

  const handleCloseSuccessSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSuccessSnackbar(false);
  };

  const handleChangeAmount = e => {
    setAmount(e.target.value);
  };

  const handleChangeToAddress = e => {
    setToAddress(e.target.value);
  };

  const handleCreateTransaction = () => {
    const newTx = new Transaction(
      blockchainService.wallet.signingKeyObj.getPublic("hex"),
      toAddress,
      parseInt(amount),
    );
    newTx.signTransaction(blockchainService.wallet.signingKeyObj);

    try {
      networkService.createTransaction(newTx);
      setOpenSuccessSnackbar(true);
    } 
    catch (e) {
      setErrorMsg(e.message);
      setOpenErrorSnackbar(true);
    }
  };

  return (
    <DashboardContent>
      <Box sx={wrapperStyle}>
        <Paper>
          <Box sx={containerStyle} component="section">
            <Typography variant="h6" fontWeight={700}>
              Send
            </Typography>
            <Grid container spacing={1} marginTop={3} marginBottom={4}>
              <Grid item xs={6}>
                <Input
                  label="Coin"
                  value="LMAO"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  onChange={handleChangeAmount}
                  label="Amount"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Box>
              <Input
                onChange={handleChangeToAddress}
                label="Address"
                fullWidth/>
              <Stack marginTop={4}>
                <ContainedButton
                  onClick={handleCreateTransaction}
                  style={{
                    margin: "0 auto",
                  }}>
                  Sign & Send
                </ContainedButton>
              </Stack>
            </Box>
          </Box>
        </Paper>
        <Snackbar
          open={openErrorSnackbar}
          autoHideDuration={2000}
          onClose={handleCloseErrorSnackbar}>
          <Alert
            onClose={handleCloseErrorSnackbar}
            severity="error"
            sx={{ width: "100%" }}>
            {errorMsg}
          </Alert>
        </Snackbar>

        <Snackbar
          open={openSuccessSnackbar}
          autoHideDuration={2000}
          onClose={handleCloseSuccessSnackbar}>
          <Alert
            onClose={handleCloseSuccessSnackbar}
            severity="success"
            sx={{ width: "100%" }}>
            Send successfully
          </Alert>
        </Snackbar>
        
      </Box>
    </DashboardContent>
  );
}