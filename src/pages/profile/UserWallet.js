import React, { useEffect, useState } from "react";
import SettingSidebar from "../../components/profile/SettingSidebar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spin } from "antd";

const UserWallet = () => {
  const user = useSelector((state) => state.user);
  const [userLoaded, setUserLoaded] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("User state", user);
    if (user && user.userId !== undefined) {
      setUserLoaded(true);
      if (user.userId === "") {
        navigate("/login");
      }
    }
  }, [user, navigate]);

  if (!userLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-row max-w-[1400px] mx-auto">
      <div className="w-1/4">
        <SettingSidebar index={"wallet"} />
      </div>
      <div className="w-3/4">{/* Content */}</div>
    </div>
  );
};

export default UserWallet;
