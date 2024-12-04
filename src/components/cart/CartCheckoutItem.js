import { Button, Image, message, Modal, Statistic } from "antd";
import React, { memo, useEffect, useMemo, useState } from "react";
import { getImageByCloudinary } from "../../helpers/getImageByCloudinary";
import {
  ClockCircleFilled,
  DownOutlined,
  SearchOutlined,
  WarningFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Countdown } = Statistic;

const CartCheckoutItem = (props) => {
  const { item, key } = props;
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const totalPrice = useMemo(() => {
    return item?.details?.finalPrice * item?.amount;
  }, [item?.details?.finalPrice, item?.amount]);
  useEffect(() => {
    if (localStorage.getItem("flashSaleEnded")) {
      setOpenModal(true);
    }
  }, []);
  return (
    <div className="grid grid-cols-12 mb-2" key={key}>
      <div className="col-span-4">
        <Image
          src={getImageByCloudinary(item?.details?.productImage)}
          className="size-40"
        />
      </div>
      <div className="col-span-8 pl-2">
        <div className="font-semibold w-[300px] text-ellipsis line-clamp-1">
          {item?.details?.productName}
        </div>
        <div className="text-neutral-500">
          {item?.details?.categoryWithObjectName}
        </div>
        <div className="text-neutral-500">Qty: {item?.amount}</div>
        <div className="text-neutral-500">Size: {item?.productSizeName}</div>
        <div className="text-lg text-neutral-500 font-semibold">
          {totalPrice?.toLocaleString("vi-VN") + " VNĐ"}
        </div>
      </div>
      <div className="col-span-12  mt-4">
        {item?.registerFlashSaleProduct && (
          <div className="flex justify-between">
            <div className="w-fit text-orange-500 flex gap-2 items-center">
              <ClockCircleFilled /> Flash Sale will ended in{" "}
              <Countdown
                valueStyle={{
                  color: "#ff4d4f",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
                onFinish={() => {
                  localStorage.setItem("flashSaleEnded", true);

                  setOpenModal(true);
                }}
                value={new Date(item?.registerFlashSaleProduct?.ended_at)}
              />
            </div>
            {item?.registerFlashSaleProduct?.quantity -
              item?.registerFlashSaleProduct?.sold <=
              10 && (
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-400">Left: </span>
                <span className="text-sm text-primary font-semibold">
                  {item?.registerFlashSaleProduct?.quantity -
                    item?.registerFlashSaleProduct?.sold}{" "}
                  products
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      <Modal
        open={openModal}
        centered={true}
        closable={false}
        footer={
          <div className="w-full flex justify-center items-center">
            <Button
              size="large"
              onClick={() => (
                navigate("/cart"), localStorage.removeItem("flashSaleEnded")
              )}
            >
              Go to cart
            </Button>
          </div>
        }
      >
        <div className="text-2xl text-center w-full font-semibold">
          Flash Sale ended !!!
        </div>
      </Modal>
    </div>
  );
};

export default memo(CartCheckoutItem);
