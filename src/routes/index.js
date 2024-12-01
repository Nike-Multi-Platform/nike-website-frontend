import React, { lazy, Suspense } from "react";
import App from "../App";
import AuthLayout from "../layout";
import { createBrowserRouter } from "react-router-dom";
import { Spin } from "antd";
import CategoriesProduct from "../CategoriesProduct";

const DetailProduct = lazy(() => import("../pages/products/DetailProduct"));
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/authentication/Login"));
const Register = lazy(() => import("../pages/authentication/Register"));
const AccountSetting = lazy(() => import("../pages/profile/AccountSetting"));
const UserWallet = lazy(() => import("../pages/profile/UserWallet"));
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <AuthLayout>
            <Suspense
              fallback={
                <div className="w-full flex justify-center items-center">
                  <Spin size="large" />
                </div>
              }
            >
              <Home />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/categories/:subCategoryId",
        element: (
          <AuthLayout>
            <Suspense
              fallback={
                <div className="w-full flex justify-center items-center">
                  <Spin size="large" />
                </div>
              }
            >
              <CategoriesProduct />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthLayout>
            <Suspense
              fallback={
                <div className="w-full flex justify-center items-center">
                  <Spin size="large" />
                </div>
              }
            >
              <Login />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/register",
        element: (
          <AuthLayout>
            <Suspense
              fallback={
                <div className="w-full flex justify-center items-center">
                  <Spin size="large" />
                </div>
              }
            >
              <Register />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/account-setting",
        element: (
          <AuthLayout>
            <Suspense
              fallback={
                <div className="w-full flex justify-center items-center">
                  <Spin size="large" />
                </div>
              }
            >
              <AccountSetting />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/user-wallet",
        element: (
          <AuthLayout>
            <Suspense
              fallback={
                <div className="w-full flex justify-center items-center">
                  <Spin size="large" />
                </div>
              }
            >
              <UserWallet />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/detail-product/:product_parent_id",
        element: (
          <AuthLayout>
            <Suspense
              fallback={
                <div className="w-full flex justify-center items-center">
                  <Spin size="large" />
                </div>
              }
            >
              <DetailProduct />
            </Suspense>
          </AuthLayout>
        ),
      },
      //Add more routes here
    ],
  },
]);

export default router;
