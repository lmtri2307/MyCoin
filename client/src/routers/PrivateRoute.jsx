import { useContext, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { MainContext } from "../contexts/MainContext";
import LoadingPage from "../components/loading/Loading";

export default function PrivateRoute() {
  const { blockchainService, networkService } = useContext(MainContext);
  const [_, rerender] = useState();
  
  const auth = blockchainService !== undefined && networkService !== undefined;
  if(!auth) return <Navigate to="/" replace />;
  
  const isReady = networkService.isReady();
  if(!isReady){
    networkService.onDoneInitialSync = () => rerender({});
    return <LoadingPage/>
  };  
  return <Outlet/>;
  // return auth ? <Outlet /> : <Navigate to="/" replace />;
}