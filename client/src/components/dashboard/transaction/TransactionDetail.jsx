import {Box,Divider,List,ListItem,ListItemText,listItemTextClasses,Typography, typographyClasses} from "@mui/material";
import { useContext } from "react";
import { MainContext } from "../../../contexts/MainContext";
import Paper from "../Paper";
import { addressLabel } from "../../../utils/adress-label";
  
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
  
export default function TransactionDetail({ txObj, txHash }) {
  const { blockchainNetworkService } = useContext(MainContext);
  let tx = null;

  if (txObj) {
    tx = txObj;
  } 
  else {
    tx = blockchainNetworkService.blockchainService.getTransaction(txHash);
  }

  return (
    <Paper>
    <Box sx={wrapperStyle} marginTop={5}>

      <Box sx={detailHeaderStyle}>
        <Typography sx={titleStyle}>Transaction Details</Typography>
      </Box>

      <Box>
        <List>

          <ListItem sx={listItemStyle}>
            <ListItemText
              primary={<Typography>Transaction Hash:</Typography>}/>

            <ListItemText primary={<Typography>{tx.hash}</Typography>}/>

          </ListItem>

          <ListItem sx={listItemStyle}>
            <ListItemText primary={<Typography>Status:</Typography>}/>
            <ListItemText primary={<Typography>Success</Typography>}/>
          </ListItem>

          <ListItem sx={listItemStyle}>
            <ListItemText primary={<Typography>Timestamp:</Typography>}/>
            <ListItemText primary={<Typography>{tx.timestamp}</Typography>}/>
          </ListItem>

        </List>

        <Divider/>

        <List>

          <ListItem sx={listItemStyle}>
            <ListItemText primary={<Typography>From:</Typography>}/>
            <ListItemText
              primary={<Typography>{
                addressLabel(tx.fromAddress)
              }</Typography>}/>
          </ListItem>

          <ListItem sx={listItemStyle}>
            <ListItemText primary={<Typography>To:</Typography>}/>
            <ListItemText primary={<Typography>{tx.toAddress}</Typography>}/>
          </ListItem>

        </List>

        <Divider/>

        <List>

          <ListItem sx={listItemStyle}>
            <ListItemText primary={<Typography>Value:</Typography>}/>
            <ListItemText primary={<Typography>{tx.amount}</Typography>}/>
          </ListItem>

        </List>
      </Box>
      
    </Box>
    </Paper>
  );
}