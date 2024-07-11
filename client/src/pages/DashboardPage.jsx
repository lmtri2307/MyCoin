import { Box, Snackbar, Alert } from "@mui/material";
import DashboardSidebar from "../components/dashboard/sidebar/DashboardSidebar";
import { Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import { MainContext } from "../contexts/MainContext";

export default function DashboardPage() {
  const { networkService } = useContext(MainContext);
  const [ showSnakbar, setShowSnackbar ] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowSnackbar(false);
  };
  networkService.onProposedBlock = () => {
    setShowSnackbar(true);
  }
  return (
    <Box sx={{ display: "flex" }}>
      <DashboardSidebar />
      <Outlet/>
      <Snackbar
          open={showSnakbar}
          autoHideDuration={5000}
          onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="info"
            sx={{ width: "100%" }}>
            Prosposed next Block
          </Alert>
        </Snackbar>
    </Box>
  );
}