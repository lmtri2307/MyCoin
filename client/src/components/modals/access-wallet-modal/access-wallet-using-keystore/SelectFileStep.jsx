import { Alert, Box, Grid, Snackbar, Typography } from "@mui/material";
import { useContext, useState } from "react";
import OutlinedButton from "../../../buttons/OutlinedButton";
import ModalStepHeader from "../../ModalStepHeader";
import { StepperContext } from "../../../../contexts/StepperContext";
import { AccessWalletUsingKeystoreContext } from "../../../../contexts/AccessWalletUsingKeystoreContext";

export default function SelectFileStep() {
  const { handleNext } = useContext(StepperContext);
  const { saveKeystore } = useContext(AccessWalletUsingKeystoreContext);
  const [isLoading, setIsLoading] = useState();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState();

  const handleSelectFile = e => {
    const reader = new FileReader();
    reader.onloadstart = () => {
      setIsLoading(true);
    };

    reader.onload = e => {
      const text = e.target.result;

      try {
        JSON.parse(text);
        saveKeystore(text);
        handleNext();
      } catch (e) {
        setError(e.message);
        setOpenSnackbar(true);
      }
    };

    reader.onloadend = () => {
      setIsLoading(false);
    };

    if (e.target && e.target.files[0]) {
      reader.readAsText(e.target.files[0]);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };


  return (
    <Box>
      <ModalStepHeader headline="STEP 1." title="Select your Keystore File" />
      <Grid marginTop="12px" container alignItems="center">
        <Grid sx={{
            textAlign: "start",
            }}
          item
          xs={5.5}>
          <Typography fontSize="14px" marginBottom="24px">
            Please select keystore file that unlocks your wallet.
          </Typography>
          <Box>

            <OutlinedButton loading={isLoading} component="label" fullWidth>
              Select File
              <input onChange={handleSelectFile} type="file" hidden />
            </OutlinedButton>

          </Box>
        </Grid>
        <Grid item xs={6.5}>
          <Box
            sx={{
              width: "75%",
              height: "191px",
              margin: "0 0 0 auto",
              backgroundImage:
                "url('./images/access-wallet/keystore-file.jpg')",
              backgroundPosition: "center center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          />
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleClose}>

        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
        
      </Snackbar>
    </Box>
  );
}