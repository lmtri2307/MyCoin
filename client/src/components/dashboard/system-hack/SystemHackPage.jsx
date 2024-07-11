import DashboardContent from "../DashboardContent";
import Paper from "../Paper";
import ContainedButton from "../../buttons/ContainedButton";
import { Box } from "@mui/material";
import { useContext } from "react";
import { MainContext } from "../../../contexts/MainContext";

const wrapperStyle = {
  maxWidth: "736px",
};

const containerStyle = {
  padding: "32px 48px",
};

export default function SystemHackPage() {
    const {networkService} = useContext(MainContext);

    const handleHackCoin = () => {
        networkService.hackCoin();
    }

  return (
    <DashboardContent>
      <Box sx={wrapperStyle}>
        <Paper>
          <Box sx={containerStyle} component="section">
            <ContainedButton
                onClick={handleHackCoin}>
                Hack 10 coin
            </ContainedButton>
          </Box>
        </Paper>
      </Box>
    </DashboardContent>
  );
}