import {Avatar,Box,Chip,Link,ListItem,ListItemIcon,ListItemText, listItemTextClasses, Typography,typographyClasses,} from "@mui/material";
import { MintService } from "../../../services/mint.service";
import { addressLabel } from "../../../utils/adress-label";
import { COIN } from "../../../utils/constants";

const smallTextStyle = {
    [`& .${typographyClasses.root}`]: {
      fontSize: "11px",
      marginTop: "8.5px",
    },
};
  
const normalTextStyle = {
    [`& .${typographyClasses.root}`]: {
      fontSize: "14px",
    },
};
  
const transactionIdWrapperStyle = {
    maxWidth: "425px",
    overflow: "hidden",

    [`& .${typographyClasses.root}`]: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
};
  
const addressesContainerStyle = {
    marginLeft: "35px",
    
    [`& .${listItemTextClasses.root}`]: {
      maxWidth: "425px",
  
      [`& .${typographyClasses.root}`]: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
};
  
const chipWrapperStyle = {
    marginLeft: "auto",
};
  
export default function TransactionListItem({txHash, fromAddress, toAddress, amount, handleClick}) {
  return (
      fromAddress !== MintService.MINT_PUBLIC_ADDRESS && (
        <ListItem>

          <ListItemIcon>
            <Avatar>Tx</Avatar>
          </ListItemIcon>

          <Box sx={transactionIdWrapperStyle}>
            <ListItemText
              primary={
                <Typography>
                  <Link underline="none">{txHash}</Link>
                </Typography>
              }
              sx={normalTextStyle}
              onClick={handleClick}
            />
            <ListItemText primary={"5 seconds ago"} sx={smallTextStyle} />
          </Box>

          <Box sx={addressesContainerStyle}>

            <ListItemText
              primary={
                <Typography>
                  From{" "}
                  {fromAddress ? (
                    <Link href="#" underline="none">
                      {addressLabel(fromAddress)}
                    </Link>
                  ) : (
                    "System (Block Reward)"
                  )}
                </Typography>
              }
              sx={normalTextStyle}/>

            <ListItemText
              primary={
                <Typography>
                  To{" "}
                <Link href="#" underline="none">
                  {toAddress}
                </Link>
                </Typography>
            }
            sx={normalTextStyle}/>
          </Box>

        <Box sx={chipWrapperStyle}>
          <Chip label={`${amount} ${COIN}`} />
        </Box>

      </ListItem>
    )
  );
}