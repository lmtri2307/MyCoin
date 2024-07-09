import { Box, Grid, Typography } from "@mui/material";
import { useContext } from "react";
import { StepperContext } from "../../../contexts/StepperContext";
import ContainedButton from "../../buttons/ContainedButton";
import TextButton from "../../buttons/TextButton";
import ModalStepHeader from "../ModalStepHeader";
import { CreateWalletUsingKeystoreContext } from "../../../contexts/CreateWalletUsingKeystoreContext";

export default function CreateWalletWellDoneStep() {
  const { clearState } = useContext(CreateWalletUsingKeystoreContext);
  const { handleRestart } = useContext(StepperContext);

  const handleCreateNewWallet = () => {
    clearState();
    handleRestart();
  }

  return (
    <Box>
      <ModalStepHeader headline="STEP 3." title="You're done" />
      <Grid marginTop="12px" container>
        <Grid
          sx={{
            textAlign: "start",
          }}
          item
          xs={6.25}
        >
          <Typography fontSize="14px" marginBottom="24px">
            You are now ready to take advantage of all that Ethereum has to
            offer! Access with keystore file should only be used in an offline
            setting.
          </Typography>
          <Box>
            <ContainedButton fullWidth>Access Wallet</ContainedButton>
            <TextButton
              onClick={handleCreateNewWallet}
              style={{
                marginTop: "12px",
              }}
              fullWidth
            >
              Create Another Wallet
            </TextButton>
          </Box>
        </Grid>
        <Grid item xs={5.75}>
          <Box
            sx={{
              width: "250px",
              height: "153px",
              margin: "10px 0 0 auto",
              backgroundImage:
                "url('./images/create-wallet/icon-keystore-mew.png')",
              backgroundPosition: "center center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}