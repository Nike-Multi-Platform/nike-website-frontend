import React, { lazy, Suspense } from "react";
import App from "../App";
import AuthLayout from "../layout";
import { createBrowserRouter } from "react-router-dom";
import { Spin } from "antd";
import OrderDetailPage from "../pages/orders/OrderDetailPage";

const FlashSalePage = lazy(() => import("../pages/flashSale/FlashSalePage"));
const OrdersPage = lazy(() => import("../pages/orders/OrdersPage"));
const CheckoutResultPage = lazy(() =>
  import("../pages/cart/CheckoutResultPage")
);
const CheckoutPage = lazy(() => import("../pages/cart/CheckoutPage"));
const CategoriesProduct = lazy(() =>
  import("../pages/search-filter/CategoriesProduct")
);
const FavoritePage = lazy(() => import("../pages/favorites/FavoritePage"));
const CartPage = lazy(() => import("../pages/cart/CartPage"));
const DetailProduct = lazy(() => import("../pages/products/DetailProduct"));
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/authentication/Login"));
const Register = lazy(() => import("../pages/authentication/Register"));
const AccountSetting = lazy(() => import("../pages/profile/AccountSetting"));
const UserWallet = lazy(() => import("../pages/profile/UserWallet"));
const ChangePassword = lazy(() => import("../pages/profile/ChangePassword"));
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
        path: "/categories",
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
        path: "/change-password",
        element: (
          <AuthLayout>
            <Suspense
              fallback={
                <div className="w-full flex justify-center items-center">
                  <Spin size="large" />
                </div>
              }
            >
              <ChangePassword />
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
      {
        path: "/favorites",
        element: (
          <AuthLayout>
            <Suspense
              fallback={
                <div className="w-full flex justify-center items-center">
                  <Spin size="large" />
                </div>
              }
            >
              <FavoritePage />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/cart",
        element: (
          <AuthLayout>
            <Suspense
              fallback={
                <div className="w-full flex justify-center items-center">
                  <Spin size="large" />
                </div>
              }
            >
              <CartPage />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/cart/checkout",
        element: (
          <AuthLayout>
            <Suspense
              fallback={
                <div className="w-full flex justify-center items-center">
                  <Spin size="large" />
                </div>
              }
            >
              <CheckoutPage />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/cart/checkout/result",
        element: (
          <AuthLayout>
            <Suspense
              fallback={
                <div className="w-full flex justify-center items-center">
                  <Spin size="large" />
                </div>
              }
            >
              <CheckoutResultPage />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/orders",
        element: (
          <AuthLayout>
            <Suspense
              fallback={
                <div className="w-full flex justify-center items-center">
                  <Spin size="large" />
                </div>
              }
            >
              <OrdersPage />
            </Suspense>
          </AuthLayout>
        ),
        children: [],
      },
      {
        path: "/orders/details/:order_id",
        element: (
          <AuthLayout>
            <Suspense
              fallback={
                <div className="w-full flex justify-center items-center">
                  <Spin size="large" />
                </div>
              }
            >
              <OrderDetailPage />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/flash-sales",
        element: (
          <AuthLayout>
            <Suspense
              fallback={
                <div className="w-full flex justify-center items-center">
                  <Spin size="large" />
                </div>
              }
            >
              <FlashSalePage />
            </Suspense>
          </AuthLayout>
        ),
      },
      //Add more routes here
    ],
  },
]);

export default router;
