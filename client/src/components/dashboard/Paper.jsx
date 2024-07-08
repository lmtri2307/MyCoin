import { Paper as MuiPaper } from "@mui/material";

const style = {
  backgroundColor: "white",
  borderColor: "white",
  borderRadius: "12px",
  boxShadow: "0 12px 17px rgba(21,29,63,.03)",
};

export default function Paper({ children }) {
  return <MuiPaper sx={style}>{children}</MuiPaper>;
}