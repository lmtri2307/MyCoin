import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { MainContext } from "../../../contexts/MainContext";
import Paper from "../Paper";
import { COIN } from "../../../utils/constants";

const containerStyle = {
  minHeight: "352px",
  padding: "48px",
  backgroundImage:
    "url('/images/dashboard/coin-balance-section/bg-circle-triangle.png')",
  backgroundRepeat: "no-repeat",
  backgroundSize: "180px",
  backgroundPosition: "right 60px bottom -1px",
};

export default function CoinBalanceSection() {
  const { blockchainService } = useContext(MainContext);
  const balance = blockchainService.getBalanceOfAddress(
    blockchainService.wallet.signingKeyObj.getPublic("hex"),
  );

  return (
    <Paper>
      <Box sx={containerStyle} component="section">
        <Typography variant="h6" fontWeight={700}>
          My {COIN} balance is
        </Typography>
        <Box marginTop={3}>
          <Typography variant="h4" fontWeight={700}>
            {balance} {COIN}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}