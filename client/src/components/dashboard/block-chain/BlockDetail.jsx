import {Box, List, ListItem, ListItemText, listItemTextClasses, Typography, typographyClasses} from "@mui/material";
import { useContext } from "react";
import { MainContext } from "../../../contexts/MainContext";
import Paper from "../Paper";
import TransactionDetail from "../transaction/TransactionDetail";
  
const wrapperStyle = {
    padding: "12px 0 10px",
};
  
const detailHeaderStyle = {
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
};
  
const titleStyle = {
    padding: "0 16px",
    fontWeight: 700,
    lineHeight: "46px",
};
  
const listItemStyle = {
    [`& .${listItemTextClasses.root}:first-of-type`]: {
      maxWidth: "500px",
      flex: "1",

    },

    [`& .${listItemTextClasses.root}:last-of-type`]: {
      flex: "3",
      [`& .${typographyClasses.root}`]: {
        whiteSpace: "normal",
        wordWrap: "break-word",
        overflowWrap: "break-word",
      },
    },
};
  
export default function BlockDetail({ blockHash }) {
    const { blockchainNetworkService } = useContext(MainContext);
    const { blockHeight, block } = blockchainNetworkService.blockchainService
      .getBlock(blockHash);
  
    return (
      <Box marginTop={5}>
        <Paper>
          <Box sx={wrapperStyle}>
            <Box sx={detailHeaderStyle}>
              <Typography sx={titleStyle}>Block Details</Typography>
            </Box>
            <Box>
              <List>
                <ListItem sx={listItemStyle}>
                  <ListItemText
                    primary={<Typography>Block Height:</Typography>}
                  />
                  <ListItemText
                    primary={<Typography>{blockHeight}</Typography>}
                  />
                </ListItem>
                <ListItem sx={listItemStyle}>
                  <ListItemText
                    primary={<Typography>Transactions:</Typography>}
                  />
                  <ListItemText
                    primary={<Typography>{block.transactions.length}</Typography>}
                  />
                </ListItem>
                <ListItem sx={listItemStyle}>
                  <ListItemText
                    primary={<Typography>Validator:</Typography>}
                  />
                  <ListItemText
                    primary={<Typography>{block.validator}</Typography>}
                  />
                </ListItem>
                <ListItem sx={listItemStyle}>
                  <ListItemText primary={<Typography>Timestamp:</Typography>} />
                  <ListItemText
                    primary={<Typography>{block.timestamp}</Typography>}
                  />
                </ListItem>
              </List>
            </Box>
          </Box>
        </Paper>
        {block.transactions.map(tx => (
          <TransactionDetail key={tx.hash} txObj={tx} />
        ))}
      </Box>
    );
}