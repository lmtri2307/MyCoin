import {
  inputBaseClasses,
  inputLabelClasses,
  styled,
  TextField,
} from "@mui/material";

export default styled(({ ...props }) => <TextField {...props} />)({
  [`& .${inputBaseClasses.root}`]: {
    borderRadius: "12px",
  },

  [`& .${inputBaseClasses.input}`]: {
    height: "62px",
    padding: "0 12px",
  },

  [`& .${inputLabelClasses.root}`]: {
    padding: "3px 0",
    fontSize: "14px",
  },
});