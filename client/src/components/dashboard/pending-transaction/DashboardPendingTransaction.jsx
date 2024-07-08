import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import { useContext } from "react";
import { MainContext } from "../../../contexts/MainContext";
import ContainedButton from "../../buttons/ContainedButton";
import DashboardContent from "../DashboardContent";
import Paper from "../Paper";
  
const cellStyle = {
    maxWidth: "250px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
};
    
export default function DashboardPendingTransaction() {
  const { blockchainService, networkService } = useContext(MainContext);
  const pendingTxs = blockchainService.getPendingTransactions();

    return (
      <DashboardContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell align="left">From</TableCell>
                <TableCell align="left">To</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingTxs.map((tx, index) => (
                <TableRow
                  key={tx.hash}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index}
                  </TableCell>
                  <TableCell sx={cellStyle} align="right">
                    {tx.fromAddress}
                  </TableCell>
                  <TableCell sx={cellStyle} align="right">
                    {tx.toAddress}
                  </TableCell>
                  <TableCell align="right">{tx.amount}</TableCell>
                  <TableCell align="right">{tx.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box marginTop={3}>

          <ContainedButton
            onClick={() => networkService.minePendingTransactions()}>
            Start mining
          </ContainedButton>

        </Box>
      </DashboardContent>
    );
}