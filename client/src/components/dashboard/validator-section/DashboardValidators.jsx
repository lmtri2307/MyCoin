import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import { useContext } from "react";
import { MainContext } from "../../../contexts/MainContext";
import ContainedButton from "../../buttons/ContainedButton";
import DashboardContent from "../DashboardContent";
import Paper from "../Paper";
import { addressLabel } from "../../../utils/adress-label";
  
const cellStyle = {
    whiteSpace: "normal",
    wordWrap: "break-word",
    overflowWrap: "break-word",
};
    
export default function DashboardValidators() {
  const { blockchainService, networkService } = useContext(MainContext);
  const validatorAddresses = blockchainService.validators;
  validatorAddresses.sort();
    return (
      <DashboardContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell align="left">Validator Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {validatorAddresses.map((validator, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="left">
                    <Box sx={cellStyle}>
                      {addressLabel(validator)}
                    </Box>
                  </TableCell>
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