import React, { memo, useReducer } from "react";
import { BiShoppingBag } from "react-icons/bi";
import { GoDotFill } from "react-icons/go";
import { FaShippingFast } from "react-icons/fa";
import { getImageByCloudinary } from "../../helpers/getImageByCloudinary";
import { u } from "framer-motion/client";
import { Button } from "antd";
import ModalWriteReview from "../modals/ModalWriteReview";
import ModalSendRequest from "../modals/ModalSendRequest";
import { useNavigate } from "react-router-dom";

const orderStatuses = {
  "Tất Cả": "All",
  "Chờ xác nhận": "Pending Confirmation",
  "Chờ lấy hàng": "Pending Pickup",
  "Chờ giao hàng": "Pending Delivery",
  "Hoàn Thành": "Completed",
  "Đã Hủy": "Canceled",
  "Trả Hàng/Hoàn Tiền": "Return/Refund",
};
const statusColors = {
  1: "bg-yellow-500 text-white border-yellow-500",
  2: "bg-orange-500 text-white border-orange-500",
  3: "bg-purple-500 text-white border-purple-500",
  4: "bg-green-500 text-white border-green-500",
  5: "bg-red-500 text-white border-red-500",
  6: "bg-blue-500 text-white border-blue-500",
};

const OrderPrimaryItem = (props) => {
  const { order, key, onUpdate } = props;
  const navigate = useNavigate();
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      modal: {
        visible: false,
        type: null,
      },
    }
  );

  const handleOpenModal = (type) => {
    setLocalState({
      type: "modal",
      payload: {
        visible: true,
        type: type,
      },
    });
  };
  const handleCloseModal = () => {
    setLocalState({
      type: "modal",
      payload: {
        visible: false,
        type: null,
      },
    });
  };
  const handleViewOrderDetail = () => {
    navigate(`/orders/details/${order.userOrderId}`);
  };

  const renderButton = (userOrderStatusId) => {
    switch (userOrderStatusId) {
      case 1:
        return (
          <Button
            size="large"
            className={`rounded-full ${
              !order.isSendCancelRequest
                ? "bg-red-500 font-semibold text-white border-red-500"
                : ""
            } hover:opacity-80 text-lg w-[150px] h-[50px]`}
            disabled={order.isSendCancelRequest}
            onClick={() => handleOpenModal("cancel-request")}
          >
            {order.isSendCancelRequest ? "Request sent" : "Cancel Request"}
          </Button>
        );
      case 2:
        return (
          <Button
            size="large"
            className={`rounded-full ${
              !order.isSendCancelRequest
                ? "bg-red-500 font-semibold text-white border-red-500"
                : ""
            } hover:opacity-80 text-lg w-[150px] h-[50px]`}
            disabled={order.isSendCancelRequest}
            onClick={() => handleOpenModal("cancel-request")}
          >
            {order.isSendCancelRequest ? "Request sent" : "Cancel Request"}
          </Button>
        );

      case 4:
        return (
          <>
            <Button
              size="large"
              className={`rounded-full ${
                !order.isSendRefundRequest
                  ? "bg-red-500 font-semibold text-white border-red-500"
                  : ""
              } hover:opacity-80 text-lg w-[150px] h-[50px]`}
              disabled={order.isSendRefundRequest}
              onClick={() => handleOpenModal("refund-request")}
            >
              {order.isSendRefundRequest ? "Request sent" : "Return Request"}
            </Button>
            <Button
              size="large"
              className={`rounded-full ${
                !order.isReviewed
                  ? "bg-orange-500 font-semibold text-white border-orange-500"
                  : ""
              } hover:opacity-80 text-lg w-[150px] h-[50px]`}
              disabled={order.isReviewed}
              onClick={() => handleOpenModal("review")}
            >
              {order.isReviewed ? "Reviewed" : "Reviews"}
            </Button>
          </>
        );
      default:
        if (userOrderStatusId !== 5 && userOrderStatusId !== 6) {
          return (
            <button className="bg-blue-500 text-white rounded-lg px-4 py-2">
              Cancel Order
            </button>
          );
        }
        return null; // Không render button nếu statusId là 6
    }
  };
  return (
    <>
      <div
        key={key}
        className="border-[1px] rounded-lg hover:shadow-lg  cursor-pointer"
        onClick={handleViewOrderDetail}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <BiShoppingBag className="text-2xl" />
              <span> Order #{order.userOrderId}</span>
            </div>
            <div className="flex gap-2 items-center">
              {order?.serviceLogs !== null && (
                <div className="flex items-center gap-1 text-base text-blue-500 pr-2 border-r-[1px] border-solid border-slate-200">
                  <FaShippingFast />
                  <span className="font-semibold">
                    {order?.serviceLogs?.ghnStatusDescription}
                  </span>
                </div>
              )}

              <div
                className={`p-2 rounded-full border-[1px] ${
                  statusColors[order.userOrderStatusId]
                }`}
              >
                <span className="text-xs font-semibold flex items-center gap-1">
                  <GoDotFill /> {orderStatuses[order.userOrderStatusName]}
                </span>
              </div>
            </div>
          </div>
          <section className="flex flex-col gap-3 my-7">
            {order?.userOrderItems?.map((item, index) => (
              <div className="flex gap-2 rounded-lg border-[1px]">
                <img
                  src={getImageByCloudinary(item?.thumbnail)}
                  alt=""
                  className="size-40 rounded-tl-lg rounded-bl-lg"
                />
                <div className="w-full flex-1 flex flex-col gap-1">
                  <span className="text-lg font-semibold">
                    {item?.productName}
                  </span>
                  <span className="font-semibold text-neutral-600">
                    {item?.price?.toLocaleString("vi-vn")} VNĐ{" "}
                    <span className="text-neutral-500 text-sm">
                      x{item?.amount}
                    </span>
                  </span>
                  <span className="font-semibold">{item?.sizeName}</span>
                </div>
              </div>
            ))}
          </section>
        </div>
        <div className="w-full border-t-[1px] border-solid p-6 flex justify-between items-center">
          <span className="text-lg ">
            Total:{" "}
            <span className="text-2xl font-semibold text-neutral-700">
              {order?.finalPrice?.toLocaleString("vi-vn")} VNĐ
            </span>
          </span>
          <div className="flex items-center gap-2 ">
            <Button
              size="large"
              className="rounded-full bg-neutral-100 font-semibold text-black border-neutral-100 hover:opacity-80 text-lg w-[150px] h-[50px]"
              onClick={handleViewOrderDetail}
            >
              Details
            </Button>
            {renderButton(order.userOrderStatusId)}
          </div>
        </div>
      </div>
      <ModalWriteReview
        order={order}
        openModal={
          localState?.modal.type === "review" ? localState.modal.visible : false
        }
        onUpdate={onUpdate}
        onClose={handleCloseModal}
      />
      <ModalSendRequest
        order={order}
        onUpdate={onUpdate}
        openModal={
          localState?.modal.type === "cancel-request" ||
          localState?.modal.type === "refund-request"
            ? localState.modal.visible
            : false
        }
        type={localState?.modal.type}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default memo(OrderPrimaryItem);
