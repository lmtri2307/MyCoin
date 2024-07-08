import { Box, Button, List, Typography } from "@mui/material";
import Paper from "../Paper";

const wrapperStyle = {
  padding: "12px 0 10px",
};

const listHeaderStyle = {
  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
};

const titleStyle = {
  padding: "0 16px",
  fontWeight: 700,
  lineHeight: "46px",
};

const listContentStyle = {
  maxHeight: "500px",
  overflow: "auto",
};

const listFooterStyle = {
  padding: "10px 16px 0",
  display: "flex",
  justifyContent: "center",
  borderTop: "1px solid rgba(0, 0, 0, 0.1)",
};

export default function TransactionList({ children }) {
  return (
    <Paper>
      <Box sx={wrapperStyle}>
        <Box sx={listHeaderStyle}>
          <Typography sx={titleStyle}>Latest Transactions</Typography>
        </Box>

        <List sx={listContentStyle}>{children}</List>
        
        <Box sx={listFooterStyle}>
          <Button variant="outlined">View all transactions</Button>
        </Box>
      </Box>
    </Paper>
  );
}