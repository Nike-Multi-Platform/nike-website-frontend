import { Input, Menu, Skeleton } from "antd";
import React, { lazy, Suspense, useEffect, useReducer } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { getOrders, getStatuses } from "../../services/orderService";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderContainer = lazy(() =>
  import("../../components/order/OrderContainer")
);
const orderStatuses = {
  "Tất Cả": "All",
  "Chờ xác nhận": "Pending Confirmation",
  "Chờ lấy hàng": "Pending Pickup",
  "Chờ giao hàng": "Pending Delivery",
  "Hoàn Thành": "Completed",
  "Đã Hủy": "Canceled",
  "Trả Hàng/Hoàn Tiền": "Return/Refund",
};
const OrdersPage = () => {
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      loading: false,
      statuses: [],
      orders: [],
      searchText: "",
      totalPages: 0,
    }
  );
  const navigate = useNavigate();
  const statusId =
    new URLSearchParams(window.location.search).get("statusId") || 0;
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await getStatuses();

        setLocalState({ type: "statuses", payload: response.data });
      } catch (error) {
        console.error(error);
      }
    };
    fetchStatuses();
  }, []);

  const handleOnSearch = (e) => {
    const value = e.target.value;
    setLocalState({ type: "searchText", payload: value });
  };
  const handleSubmitSearch = (e) => {
    if (e.key === "Enter") {
      navigate(
        `/orders?statusId=${statusId}&keywords=${localState.searchText}&page=1`
      );
    }
  };
  return (
    <div className="max-w-[1400px] mx-auto my-20 flex flex-col gap-4">
      <span className="text-3xl font-nike w-full text-center font-[600] text-neutral-700">
        My Orders
      </span>
      <section className="w-full flex justify-between items-center  gap-2">
        <Menu
          className="w-full flex justify-center"
          mode="horizontal"
          selectedKeys={[statusId]}
          items={localState.statuses.map((item) => ({
            label: (
              <span
                onClick={() =>
                  navigate(`/orders?statusId=${item.userOrderStatusId}`)
                }
                className="font-semibold text-xl"
              >
                {orderStatuses[item.userOrderStatusName]}
              </span>
            ),
            key: item.userOrderStatusId,
          }))}
        />

        <Input
          // className="col-span-9"
          size="large"
          prefix={<SearchOutlined className="text-2xl text-neutral-400" />}
          placeholder="Product Name/Order NO."
          onChange={handleOnSearch}
          onKeyDown={handleSubmitSearch}
        />
      </section>
      <section className="w-full">
        <Suspense fallback={<Skeleton.Node active={true} className="w-full" />}>
          <OrderContainer />
        </Suspense>
      </section>
    </div>
  );
};

export default OrdersPage;
