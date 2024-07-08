import { Box, Stack, Typography } from "@mui/material";
import Paper from "../Paper";
import { COIN } from "../../../utils/constants";

const wrapperStyle = {
  minHeight: "132px",
  padding: "20px 28px",
  justifyContent: "space-between",
};

export default function NetworkSection() {
  return (
    <Paper>
      <Stack sx={wrapperStyle} component="section">
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Network
          </Typography>
          <Box marginTop={2}>
            <Typography variant="body2" marginBottom={1}>
              {COIN} 
            </Typography>
            <Typography variant="body2">Last Black: 0</Typography>
          </Box>
        </Box>
        <Box></Box>
      </Stack>
    </Paper>
  );
}