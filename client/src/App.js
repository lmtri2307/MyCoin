import "./App.css";
import HomePage from "./pages/HomePage";
import { Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import DashboardMain from "./components/dashboard/main/DashboardMain";
import DashboardTransaction from "./components/dashboard/transaction/DashboardTransaction";
import TransactionDetail from "./components/dashboard/transaction/TransactionDetail";
import DashboardValidators from "./components/dashboard/validator-section/DashboardValidators";
import DashboardSendSection from "./components/dashboard/send-section/DashboardSendSection";
import DashboardBlockchain from "./components/dashboard/block-chain/DashboardBlockchain";
import { MainContext } from "./contexts/MainContext";
import { useEffect, useState } from "react";
import { BlockchainService } from "./services/blockchain.service";
import PrivateRoute from "./routers/PrivateRoute";
import { NetworkService } from "./services/network.service";
import { MintService } from "./services/mint.service";
import { useNavigate } from "react-router-dom";
import { WalletService } from "./services/wallet.service";
import SystemHackPage from "./components/dashboard/system-hack/SystemHackPage";

function App() {
  const nagivate = useNavigate();
  const [blockchainService, setBlockchainService] = useState();
  const [networkService, setNetworkService] = useState();
  const [flag, setFlag] = useState(false);
  const rerender = () => setFlag(prev => !prev);

  useEffect(() => {
    let needToCleanUp = false;
    const loadWalletFromStorage = async () => {
      const wallet = await WalletService.loadWallet();
      if (!wallet) return;
      if (needToCleanUp) return;
      handleSetWallet(wallet);
    }
    loadWalletFromStorage();
    return () => {
      needToCleanUp = true;
    }
  }, []);

  const handleClearWallet = () => {
    WalletService.clearWallet();
    setBlockchainService(undefined);
    setNetworkService(undefined);
    nagivate("/");
  }

  const handleSetWallet = wallet => {
    WalletService.saveWallet(wallet);
    const mintService = new MintService();
    const newBlockchainService = new BlockchainService(wallet);
    const newNetworkService = new NetworkService(mintService, newBlockchainService);
    newNetworkService.onDoneInitialSync = () => {
      rerender();
      console.log("called")
    }
    setBlockchainService(newBlockchainService);
    setNetworkService(newNetworkService);
    nagivate("/wallet/dashboard/main");
  };

  return (
    <MainContext.Provider
      value={{ blockchainService, networkService, handleSetWallet, handleClearWallet }}
    >
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route element={<PrivateRoute />}>

          <Route element={<DashboardPage />}>
            <Route path="/wallet/dashboard/main" element={<DashboardMain />} />

            <Route
              path="/wallet/dashboard/blockChain"
              element={<DashboardBlockchain />}
            />

            <Route
              path="/wallet/dashboard/send"
              element={<DashboardSendSection />}
            />

            <Route
              path="/wallet/dashboard/transactions"
              element={<DashboardTransaction />}
            />

            <Route
              path="/wallet/dashboard/validators"
              element={<DashboardValidators />}
            />

            <Route
              path="/wallet/dashboard/systemHack"
              element={<SystemHackPage />}
            />

          </Route>
        </Route>
      </Routes>
    </MainContext.Provider>
  );
}

export default App;
