import { Grid } from "@mui/material";
import DashboardContent from "../DashboardContent";
import CoinBalanceSection from "./CoinBalanceSection";
import CoinValueSection from "./CoinValueSection";
import NetworkSection from "./NetworkSection";

export default function DashboardMain() {
  return (
    <DashboardContent>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <CoinBalanceSection />
        </Grid>
        <Grid item xs={4}>
          <NetworkSection />
        </Grid>
        <Grid item xs={8}>
          <CoinValueSection />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}