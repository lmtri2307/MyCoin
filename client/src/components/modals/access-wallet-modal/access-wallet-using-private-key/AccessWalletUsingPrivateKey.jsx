import { Box, Stack, Typography } from "@mui/material";
import ContainedButton from "../../../buttons/ContainedButton";
import ModalInput from "../../../input/Input";
import { useState } from "react";

export default function AccessWalletUsingPrivateKey() {
  const [privateKey, setPrivateKey] = useState("");

  const handleOnChangePrivateKey = e => {
    setPrivateKey(e.target.value);
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
        <ContainedButton disabled>Access Wallet</ContainedButton>
      </Box>
    </Stack>
  );
}