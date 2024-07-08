import { Button, styled } from "@mui/material";

export default styled(({ ...props }) => <Button {...props} variant="text" />)
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