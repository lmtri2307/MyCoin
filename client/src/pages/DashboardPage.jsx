import { Box } from "@mui/material";
import DashboardSidebar from "../components/dashboard/sidebar/DashboardSidebar";
import { Outlet } from "react-router-dom";

export default function DashboardPage() {
  return (
    <Box sx={{ display: "flex" }}>
      <DashboardSidebar />
      <Outlet/>
    </Box>
  );
}