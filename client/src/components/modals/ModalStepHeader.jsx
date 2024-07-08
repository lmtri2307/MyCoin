import { Box, Typography } from "@mui/material";

const wrapperStyle = {
  textAlign: "start",
};

const headlineStyle = {
  marginBottom: "3.5px",
  color: "#9E9E9E",
  fontSize: "14px",
  fontWeight: 700,
  textTransform: "uppercase",
};

const titleStyle = {
  fontSize: "20px",
  fontWeight: 700,
};

const descriptionStyle = {
  fontSize: "14px",
};

export default function ModalStepHeader({ headline, title, description }) 
{
  return (
    <Box sx={wrapperStyle}>
      <Typography sx={headlineStyle}>{headline}</Typography>
      <Typography sx={titleStyle}>{title}</Typography>
      <Typography sx={descriptionStyle}>{description}</Typography>
    </Box>
  );
}