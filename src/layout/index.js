import React, { useEffect } from "react";
import Header from "../components/headers/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { LogoutUser, verifyUser } from "../services/userService";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout } from "../redux/userSlice";
import { clearCart } from "../redux/cartSlice";
import Footer from "../components/headers/Footer";

const AuthLayout = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const fetchUserData = async (token) => {
    try {
      if (!token) {
        throw new Error("Token is missing.");
      }
      const payload = {
        idToken: token,
      };
      const response = await verifyUser(payload);
      if (response?.statusCode === 200) {
        // console.log("Fetch user data success", response?.data?.user);
        dispatch(setUser(response?.data?.user));
      } else {
        const errorMessage = response?.message || "Unknown error";
        console.log("Error fetching user data", errorMessage);
        dispatch(logout());
      }
    } catch (error) {
      console.log("Error when fetching user data", error);
    }
  };
  const handleLogout = async () => {
    try {
      if (user?.userId) {
        const payload = { UserId: user.userId };
        const logout_res = await LogoutUser(payload);
        if (logout_res?.statusCode === 200) {
          console.log("Logout success", logout_res);
        } else {
          console.error(
            "Error during logout:",
            logout_res?.message || "Unknown error"
          );
        }
      }
    } catch (error) {
      console.error("Error during logout:", error.message);
    } finally {
      localStorage.removeItem("token");
      dispatch(logout());
      dispatch(clearCart());
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData(token);
    } else {
      console.log("Token is missing");
      handleLogout();
    }
  }, [token]);

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default AuthLayout;
