import React from "react";
import Header from "../components/headers/Header";

const AuthLayout = ({ children }) => {
  return (
    <>
      <Header />  
      {children}
    </>
  );
};

export default AuthLayout;
