import { buttonClasses, styled } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

export default styled(({ ...props }) => (
  <LoadingButton {...props} variant="contained"/>
))
({
  height: "62px",
  padding: "0 46px",
  borderRadius: "10px",
  textTransform: "capitalize",
  backgroundColor: "#05c0a5",
  border: "1px solid #05c0a5",
  boxShadow: "none",

  "&:hover, &:focus": {
    background:
      "linear-gradient(0deg,rgba(255,255,255,.08),rgba(255,255,255,.08)),#05c0a5!important",
    boxShadow: "none",
  },

  [`&.${buttonClasses.disabled}`]: {
    color: "white",
    borderColor: "transparent",
  },
  
  a: {
    color: "white",
    textDecoration: "none",
  },
  
});