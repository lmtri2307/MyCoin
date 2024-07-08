import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { MainContext } from "../../../contexts/MainContext";
import Paper from "../Paper";

const wrapperStyle = {
  padding: "40px 32px 30px",
};

export default function CoinValueSection() {
  const { blockchainService } = useContext(MainContext);
  const balance = blockchainService.getBalanceOfAddress(
    blockchainService.wallet.signingKeyObj.getPublic("hex"),
  );

  return (
    <Paper>
      <Box sx={wrapperStyle} component="section">
        <Typography color="#667f9b" fontSize="16px" fontWeight={700}>
          MY COIN VALUE
        </Typography>
        <Typography color="#0b2840" fontSize="20px" fontWeight={700}>
          $ {balance.toFixed(2)}
        </Typography>
        <Typography variant="body2" marginTop={2} fontWeight={700}>
          1 coin - 1 $
        </Typography>
      </Box>
    </Paper>
  );
}