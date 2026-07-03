import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isAuth = localStorage.getItem("token");   // change to your auth logic

  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
