import React from "react";
import Header from "../components/headers/Header";
import { useLocation, useNavigate } from "react-router-dom";

const AuthLayout = ({ children }) => {
  const location = useLocation();
  const useType = location.pathname.split("/")[1];

  return (
    <>
      <Header />  
      {children}
    </>
  );
};

export default AuthLayout;
