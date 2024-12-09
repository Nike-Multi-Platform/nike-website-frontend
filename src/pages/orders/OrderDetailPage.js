import React, { useEffect, useReducer } from "react";
import { GrCopy } from "react-icons/gr";
import { RxCaretLeft } from "react-icons/rx";
import { useNavigate, useParams } from "react-router-dom";
import { getDetails } from "../../services/orderService";
import { Button, message, Spin, Steps } from "antd";
import { formatDate } from "date-fns";
import { CgNotes } from "react-icons/cg";
import { MdLocalShipping } from "react-icons/md";
import { HiInboxArrowDown } from "react-icons/hi2";
import { FaRegStar } from "react-icons/fa";
import { getImageByCloudinary } from "../../helpers/getImageByCloudinary";
import ModalWriteReview from "../../components/modals/ModalWriteReview";
import ModalSendRequest from "../../components/modals/ModalSendRequest";
const statusDescriptions = {
  ready_to_pick: "Seller is preparing goods",
  picking: "Picking goods",
  cancel: "Cancel order",
  money_collect_picking: "Collecting money from sender",
  picked: "Picked goods",
  storing: "Goods are in warehouse",
  transporting: "Transporting goods",
  sorting: "Sorting goods",
  delivering: "Staff is delivering to recipient",
  money_collect_delivering: "Staff is collecting money from recipient",
  delivered: "Delivery successful",
  delivery_fail: "Delivery failed",
  waiting_to_return: "Waiting for return to sender",
  return: "Return",
  return_transporting: "Transporting return goods",
  return_sorting: "Sorting return goods",
  returning: "Staff is returning goods",
  return_fail: "Staff failed to return goods",
  returned: "Staff returned goods successfully public",
  exception: "Exception order not included in the process",
  damage: "Damaged goods",
  lost: "Lost goods",
};
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
  1: " text-yellow-500 ",
  2: " text-orange-500",
  3: " text-purple-500 ",
  4: " text-green-500 ",
  5: " text-red-500 ",
  6: "text-blue-500 ",
};
const OrderDetailPage = () => {
  const navigate = useNavigate();
  const order_id = parseInt(useParams().order_id) || -1;
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      loading: false,
      orderDetails: null,
      showAllLog: false,
      modal: {
        visible: false,
        type: null,
      },
    }
  );
  const handleBack = () => {
    navigate(-1);
  };
  const fetchData = async () => {
    setLocalState({ type: "loading", payload: true });
    try {
      const res = await getDetails(order_id);
      if (res.statusCode === 200) {
        console.log(res.data);
        setLocalState({
          type: "orderDetails",
          payload: res.data,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLocalState({ type: "loading", payload: false });
    }
  };
  useEffect(() => {
    if (order_id !== -1) {
      // getDetails({ userOrderId: order_id }).then((res) => {
      //   setLocalState({
      //     type: "orderDetails",
      //     payload: res,
      //   });
      // });
      fetchData();
    }
  }, [order_id]);

  const handleCopyUserOrderId = () => {
    navigator.clipboard
      .writeText(order_id)
      .then(() => {
        message.success("Order code copied");
      })
      .catch(() => {
        message.error("Copy order code failed");
      });
  };
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

  const logReverse =
    (localState.orderDetails?.serviceLogs?.logs &&
      localState.orderDetails?.serviceLogs?.logs?.slice().reverse()) ||
    [];
  const visibleLogItem = localState.showAllLog
    ? logReverse
    : logReverse.slice(0, 3);
  const renderButton = (userOrderStatusId) => {
    switch (userOrderStatusId) {
      case 1:
        return (
          <Button
            size="large"
            className={`rounded-full ${
              !localState.orderDetails?.isSendCancelRequest
                ? "bg-red-500 font-semibold text-white border-red-500"
                : ""
            } hover:opacity-80 text-lg w-[150px] h-[50px]`}
            disabled={localState.orderDetails?.isSendCancelRequest}
            onClick={() => handleOpenModal("cancel-request")}
          >
            {localState.orderDetails?.isSendCancelRequest
              ? "Request sent"
              : "Cancel Request"}
          </Button>
        );
      case 2:
        return (
          <Button
            size="large"
            className={`rounded-full ${
              !localState.orderDetails?.isSendCancelRequest
                ? "bg-red-500 font-semibold text-white border-red-500"
                : ""
            } hover:opacity-80 text-lg w-[150px] h-[50px]`}
            disabled={localState.orderDetails?.isSendCancelRequest}
            onClick={() => handleOpenModal("cancel-request")}
          >
            {localState.orderDetails?.isSendCancelRequest
              ? "Request sent"
              : "Cancel Request"}
          </Button>
        );

      case 4:
        return (
          <>
            <Button
              size="large"
              className={`rounded-full ${
                !localState.orderDetails?.isSendRefundRequest
                  ? "bg-red-500 font-semibold text-white border-red-500"
                  : ""
              } hover:opacity-80 text-lg w-[150px] h-[50px]`}
              disabled={localState.orderDetails?.isSendRefundRequest}
              onClick={() => handleOpenModal("refund-request")}
            >
              {localState.orderDetails?.isSendRefundRequest
                ? "Request sent"
                : "Return Request"}
            </Button>
            <Button
              size="large"
              className={`rounded-full ${
                !localState.orderDetails?.isReviewed
                  ? "bg-orange-500 font-semibold text-white border-orange-500"
                  : ""
              } hover:opacity-80 text-lg w-[150px] h-[50px]`}
              disabled={localState.orderDetails.isReviewed}
              onClick={() => handleOpenModal("review")}
            >
              {localState.orderDetails.isReviewed ? "Reviewed" : "Reviews"}
            </Button>
          </>
        );
      default:
        if (userOrderStatusId !== 5) {
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
      {localState.loading && (
        <div className="flex justify-center items-center h-[300px]">
          <Spin />
        </div>
      )}
      {localState.orderDetails !== null && !localState.loading && (
        <div className="max-w-[1400px] mx-auto my-20 flex flex-col gap-4">
          <div className="flex justify-between items-center p-5 bg-white border-[1px] rounded-lg">
            <span
              className="flex items-center gap-2 text-lg capitalize cursor-pointer text-neutral-500"
              onClick={handleBack}
            >
              <RxCaretLeft />
              Back
            </span>
            <div className="flex items-center gap-3">
              <span className="pr-3 border-r-[1px] border-black flex gap-2 items-center">
                Order Code:
                {localState.orderDetails?.userOrderId}
                <GrCopy
                  className="text-blue-400 cursor-pointer"
                  onClick={handleCopyUserOrderId}
                />
              </span>

              <span
                className={`uppercase ${
                  statusColors[localState.orderDetails?.userOrderStatusId]
                }`}
              >
                {localState.orderDetails?.serviceLogs
                  ? statusDescriptions[
                      localState.orderDetails?.serviceLogs?.ghnStatus
                    ]
                  : orderStatuses[localState.orderDetails?.userOrderStatusName]}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded">
            <Steps
              items={[
                {
                  title: <span className="text-lg">Order</span>,
                  description: (
                    <span className="text-neutral-500">
                      {formatDate(
                        localState.orderDetails?.createdAt,
                        "dd/MM/yyyy HH:mm:ss"
                      )}
                    </span>
                  ),
                  status: "finish",
                  icon: <CgNotes className="text-3xl" />,
                },
                {
                  title: (
                    <span className="text-lg">
                      Delivered to the Service Provider
                    </span>
                  ),
                  description:
                    localState.orderDetails?.serviceLogs?.logs &&
                    localState.orderDetails?.serviceLogs?.logs.find(
                      (item) => item.status === "picked"
                    ) &&
                    formatDate(
                      localState.orderDetails?.serviceLogs?.logs.find(
                        (item) => item.status === "picked"
                      )?.timestamp,
                      "dd/MM/yyyy HH:mm:ss"
                    ),
                  status:
                    localState.orderDetails?.serviceLogs?.logs &&
                    localState.orderDetails?.serviceLogs?.logs.some(
                      (item) => item.status === "picked"
                    )
                      ? "finish"
                      : "wait",
                  icon: <MdLocalShipping className="text-4xl" />,
                },
                {
                  title: <span className="text-lg">Waiting for Delivery</span>,
                  description: "",
                  status:
                    localState.orderDetails?.userOrderStatusId === 4 ||
                    localState.orderDetails?.userOrderStatusId === 5
                      ? "finish"
                      : "wait",
                  icon: <HiInboxArrowDown className="text-3xl" />,
                },
                {
                  title: <span className="text-lg">Evaluate</span>,
                  description: "",
                  status:
                    localState.orderDetails?.isReviewed === 1
                      ? "finish"
                      : "wait",
                  icon: <FaRegStar className="text-3xl " />,
                },
              ]}
            />
          </div>
          <div className="w-full flex justify-end items-center gap-2">
            {renderButton(localState.orderDetails?.userOrderStatusId)}
          </div>

          {localState.orderDetails?.userOrderStatusId !== 5 &&
            localState.orderDetails?.userOrderStatusId !== 6 && (
              <div className="p-5 bg-white rounded relative">
                <div
                  className="top-0 absolute w-full h-[3px] -left-[1px]"
                  style={{
                    backgroundSize: "116px 3px",
                    backgroundPositionX: "-30px",
                    backgroundImage:
                      "repeating-linear-gradient(45deg, #6fa6d6, #6fa6d6 33px, transparent 0, transparent 41px, #f18d9b 0, #f18d9b 74px, transparent 0, transparent 82px)",
                  }}
                ></div>

                <div className="text-lg font-semibold">Delivery Address</div>
                <div className="grid grid-cols-12 mt-2 gap-4">
                  <div className="col-span-5 flex flex-col gap-3 border-r-[1px]">
                    <span className="font-semibold text-neutral-500">
                      {localState.orderDetails?.firstName +
                        " " +
                        localState.orderDetails?.lastName}
                    </span>
                    <span className="text-sm">
                      {localState.orderDetails?.phoneNumber}
                    </span>
                    <span className="text-sm">
                      {localState.orderDetails?.address}
                    </span>
                  </div>
                  <div className="col-span-7">
                    <Steps
                      direction="vertical"
                      items={visibleLogItem.map((item) => {
                        return {
                          title: (
                            <span className="text-lg">
                              {statusDescriptions[item.status]}
                            </span>
                          ),
                          description: (
                            <span className="text-neutral-500">
                              {formatDate(
                                item.timestamp,
                                "dd/MM/yyyy HH:mm:ss"
                              )}
                            </span>
                          ),
                          status: "finish",
                        };
                      })}
                    />
                    {logReverse.length > 3 && (
                      <span
                        className="pl-12 text-blue-500 cursor-pointer"
                        onClick={() =>
                          setLocalState({
                            type: "showAllLog",
                            payload: !localState.showAllLog,
                          })
                        }
                      >
                        {localState.showAllLog ? "Collapse" : "See More"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          <section className="flex flex-col gap-3 my-7">
            <span className="text-2xl font-semibold text-neutral-600">
              Order details
            </span>
            {localState.orderDetails?.userOrderItems?.map((item, index) => (
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

          {localState.orderDetails?.paymentMethod === "COD" && (
            <div className="p-5 border-primary bg-third text-primary">
              Please pay{" "}
              <span className="text-xl font-semibold">
                <sup>đ</sup>
                {localState.orderDetails?.finalPrice?.toLocaleString(
                  "vi-vn"
                )}{" "}
              </span>{" "}
              upon receipt.
            </div>
          )}
        </div>
      )}
      <ModalWriteReview
        order={localState.orderDetails}
        openModal={
          localState?.modal.type === "review" ? localState.modal.visible : false
        }
        onUpdate={fetchData}
        onClose={handleCloseModal}
      />
      <ModalSendRequest
        order={localState.orderDetails}
        onUpdate={fetchData}
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

export default OrderDetailPage;
