import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ModalCloseButton({ handleClose }) {
  return (
    <IconButton
      sx={{
        position: "absolute",
        top: "16px",
        right: "16px",
      }}
      onClick={handleClose}
      aria-label="close"
      size="large"
    >
      <CloseIcon />
    </IconButton>
  );
}