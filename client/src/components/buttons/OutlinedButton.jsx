import { styled } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

export default styled(({ ...props }) => (
  <LoadingButton {...props} variant="outlined"/>
))
({
  height: "62px",
  padding: "0 46px",
  borderRadius: "10px",
  textTransform: "capitalize",
  borderColor: "#05c0a5",
  color: "#05c0a5",

  "&:hover, &:focus": {
    backgroundColor: "rgba(5, 192, 165, 0.08)",
    borderColor: "#05c0a5",
  },
});