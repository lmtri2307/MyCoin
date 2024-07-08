import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ModalBackButton({ handleBack }) {
  return (
    <IconButton
      sx={{
        position: "absolute",
        top: "16px",
        left: "16px",
      }}
      onClick={handleBack}
      aria-label="close"
      size="large"
    >
      <ArrowBackIcon />
    </IconButton>
  );
}