import React, { memo, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getOrders } from "../../services/orderService";
import OrderPrimaryItem from "./OrderPrimaryItem";
import { BiNote } from "react-icons/bi";
import { MdOutlineEventNote } from "react-icons/md";
import { Pagination, Spin } from "antd";

const OrderContainer = () => {
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      loading: false,
      orders: [],
      totalPages: 0,
    }
  );
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusId =
    new URLSearchParams(window.location.search).get("statusId") || 0;
  const page = new URLSearchParams(window.location.search).get("page") || 1;
  const keywords =
    new URLSearchParams(window.location.search).get("keywords") || "";
  const user = useSelector((state) => state.user);

  const fetchOrders = async () => {
    try {
      setLocalState({ type: "loading", payload: true });
      const response = await getOrders({
        userId: user.userId,
        status: statusId,
        keyword: keywords,
        page: page,
        limit: 5,
      });
      console.log(response);
      if (response.statusCode === 200) {
        setLocalState({ type: "totalPages", payload: response?.totalPages });
        setLocalState({ type: "orders", payload: response?.data });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLocalState({ type: "loading", payload: false });
    }
  };
  useEffect(() => {
    if (!user.userId) return;
    fetchOrders();
  }, [keywords, statusId, page, user.userId]);

  const handlePageChange = (page, pageSize) => {
    // Lấy toàn bộ searchParams hiện tại
    const params = new URLSearchParams(searchParams);

    // Cập nhật tham số "page"
    params.set("page", page);

    // Điều hướng đến URL mới
    navigate(`?${params.toString()}`);
  };

  return (
    <>
      {localState?.loading && (
        <div className="flex h-[400px] justify-center items-center flex-col text-neutral-600">
          <Spin size="large" />
        </div>
      )}
      {!localState?.loading && (
        <div className="w-full flex flex-col gap-10 mt-8">
          {localState?.orders?.length === 0 && (
            <div className="flex h-[400px] justify-center items-center flex-col text-neutral-600">
              <MdOutlineEventNote size={50} />
              <p className="text-lg font-semibold text-center">No orders</p>
            </div>
          )}
          {localState?.orders?.length > 0 &&
            localState?.orders?.map((order, index) => {
              return (
                <OrderPrimaryItem
                  key={index}
                  order={order}
                  onUpdate={fetchOrders}
                />
              );
            })}

          <Pagination
            size="large"
            className="mt-4"
            align="center"
            defaultCurrent={page}
            total={localState?.totalPages * 5}
            showSizeChanger={false}
            onChange={handlePageChange}
            pageSize={10}
            hideOnSinglePage={localState?.orders?.length <= 5 ? true : false}
            current={page}
          />
        </div>
      )}
    </>
  );
};

export default memo(OrderContainer);
