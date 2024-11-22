import React, { lazy, Suspense } from "react";
import App from "../App";
import AuthLayout from "../layout";
import { createBrowserRouter } from "react-router-dom";
import { Spin } from "antd";
import CategoriesProduct from "../CategoriesProduct";
const Home = lazy(() => import("../pages/Home"));

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
            <CategoriesProduct />
          </AuthLayout>
        ),
      },
      //Add more routes here
    ],
  },
]);

export default router;
