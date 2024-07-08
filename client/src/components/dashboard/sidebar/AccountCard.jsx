import {Card,CardActions,CardContent,IconButton,Typography,} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useContext } from "react";
import { MainContext } from "../../../contexts/MainContext";
import { CopyToClipboard } from "react-copy-to-clipboard";

const cardStyle = {
    display: "flex",
    flexDirection: "column",
    minWidth: "260px",
    minHeight: "178px",
    padding: "16px 20px 16px 32px",
    margin: "22px 0 10px",
    color: "white",
    backgroundColor: "hsla(0,0%,100%,.1)",
    backgroundImage: "url('/images/dashboard/wallet/wallet-bg-image.png')",
    borderRadius: "16px",
    textShadow: "0 2px 8px rgb(0 0 0 / 24%), 0 1px 4px rgb(0 0 0 / 24%)",
};
  
const cardContentStyle = {
    position: "relative",
    padding: "1px 0 0 0",
};
  
const titleTypoStyle = {
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
};
  
const publicKeyTypoStyle = {
    fontSize: "10px",
    color: "hsla(0,0%,100%,.8)",
};
  
const dollarBalanceTypoStyle = {
    position: "absolute",
    top: "50px",
    left: "-20px",
    fontSize: "33px",
    fontWeight: 700,
};
  
const cardActionsStyle = {
    padding: 0,
    marginTop: "auto",
    justifyContent: "space-between",
};
  
const coinBalanceTypoStyle = {
    fontSize: "14px",
    color: "hsla(0,0%,100%,.8)",
};
  
export default function AccountCard() {
  const { blockchainService } = useContext(MainContext);
  const publicKey = blockchainService.wallet.signingKeyObj.getPublic("hex");
  const balance = blockchainService.getBalanceOfAddress(publicKey);

  return (
      <Card sx={cardStyle}>

        <CardContent sx={cardContentStyle}>
          <Typography sx={titleTypoStyle}>My personal account</Typography>
          <Typography sx={publicKeyTypoStyle}>
            {publicKey.slice(0, 6)}...
            {publicKey.slice(publicKey.length - 4, publicKey.length)}
          </Typography>

          <Typography sx={dollarBalanceTypoStyle}>
            ${balance.toFixed(2)}
          </Typography>

        </CardContent>

        <CardActions sx={cardActionsStyle}>
        <Typography sx={coinBalanceTypoStyle}>{balance} LMAO</Typography>
          <CopyToClipboard text={publicKey}>
            <IconButton aria-label="copy" size="large">
              <ContentCopyIcon />
            </IconButton>
          </CopyToClipboard>
        </CardActions>
        
      </Card>
    );
}