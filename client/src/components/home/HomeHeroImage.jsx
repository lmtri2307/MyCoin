import { Box } from "@mui/material";

export default function HomeHeroImage() {
  return (
    <Box
      sx={{
        width: "513px",
        height: "500px",
        backgroundImage:
          "url('./images/home/bg-home-spaceman-and-dog.svg')",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}