import { useContext, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { MainContext } from "../contexts/MainContext";
import LoadingPage from "../components/loading/Loading";

export default function PrivateRoute() {
  const { blockchainNetworkService } = useContext(MainContext);
  const [_, rerender] = useState();
  
  const auth = blockchainNetworkService !== undefined;
  if(!auth) return <Navigate to="/" replace />;
  
  const isReady = blockchainNetworkService.isReady();
  if(!isReady){
    blockchainNetworkService.onDoneInitialSync = () => rerender({});
    return <LoadingPage/>
  };  
  return <Outlet/>;
  // return auth ? <Outlet /> : <Navigate to="/" replace />;
}