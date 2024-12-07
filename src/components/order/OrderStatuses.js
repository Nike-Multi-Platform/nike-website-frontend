import React, { memo } from "react";
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
const OrderStatuses = (props) => {
  const { items, selectedKey } = props;
  const navigate = useNavigate();
  return (
    <ul className="w-full flex border-[1px] gap-1 rounded-lg ">
      {items.map((item, index) => (
        <li
          className={`${
            selectedKey === item?.userOrderStatusId
              ? "bg-orange-500 text-white"
              : ""
          } w-[160px] text-center py-2 rounded-lg  hover:bg-orange-500 hover:text-white cursor-pointer font-semibold`}
          key={index}
          onClick={() =>
            navigate(`/orders?statusId=${item?.userOrderStatusId}`)
          }
        >
          {orderStatuses[item?.userOrderStatusName]}
        </li>
      ))}
    </ul>
  );
};

export default memo(OrderStatuses);
