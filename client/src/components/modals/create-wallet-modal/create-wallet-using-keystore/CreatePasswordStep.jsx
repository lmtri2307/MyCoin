import { Box, Stack } from "@mui/material";
import ContainedButton from "../../../buttons/ContainedButton";
import ModalInput from "../../../input/Input";
import ModalStepHeader from "../../ModalStepHeader";
import { useContext, useEffect, useState } from "react";
import { StepperContext } from "../../../../contexts/StepperContext";
import { CreateWalletUsingKeystoreContext } from "../../../../contexts/CreateWalletUsingKeystoreContext";

export default function CreatePasswordStep() {
  const { handleNext } = useContext(StepperContext);

  const { handleCreatePassword, downloadLink } = useContext(
    CreateWalletUsingKeystoreContext,
  );

  const [password, setPassword] = useState("");

  const [confirmedPassword, setConfirmedPassword] = useState("");

  useEffect(() => {
    if (downloadLink) {
      handleNext();
    }
  }, [downloadLink, handleNext]);

  const handleOnChangePassword = e => {
    setPassword(e.target.value);
  }

  const handleOnChangeConfirmedPassword = e => {
    setConfirmedPassword(e.target.value);
  };

  const handleOnClickCreateWalletButton = () => {
    handleCreatePassword(password);
  };

  return (
    <Stack spacing={3}>
      <ModalStepHeader headline="STEP 1." title="Create password" />
      <Stack spacing={4}>
        <ModalInput
          onChange={handleOnChangePassword}
          helperText="Password must be 8 or more characters"
          label="Password"
          type="password"
          error={password.length < 8}
        />
        <ModalInput
          onChange={handleOnChangeConfirmedPassword}
          helperText={
            confirmedPassword !== password ? "Passwords do not match" : ""
          }
          label="Confirm Password"
          type="password"
          error={confirmedPassword !== password}
        />
      </Stack>

      <Box>
        <ContainedButton
          disabled={
            !(password !== "" &&
              (confirmedPassword !== "") & (password === confirmedPassword)
            )
          }
          onClick={handleOnClickCreateWalletButton}>
          Create Wallet
        </ContainedButton>
      </Box>
    </Stack>
  );
}