import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { MainContext } from "../contexts/MainContext";

export default function PrivateRoute() {
  const { blockchainService } = useContext(MainContext);
  const auth = blockchainService !== undefined;
  return auth ? <Outlet /> : <Navigate to="/" replace />;
}