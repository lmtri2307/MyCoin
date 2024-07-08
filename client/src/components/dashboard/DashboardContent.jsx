import { Box } from "@mui/material";

const outerWrapperStyle = {
  width: "100%",
  minHeight: "100vh",
  backgroundColor: "#f2f3f6",
};

const innerWrapperStyle = {
  width: "100%",
  height: "100%",
  maxWidth: "1185px",
  padding: "12px",
  margin: "64px auto 56px",
};

export default function DashboardContent({ children }) {
  return (
    <Box sx={outerWrapperStyle}>
      <Box sx={innerWrapperStyle}>{children}</Box>
    </Box>
  );
}