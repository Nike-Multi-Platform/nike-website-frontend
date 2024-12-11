import React, { memo, useCallback, useReducer } from "react";
import { getImageByCloudinary } from "../../helpers/getImageByCloudinary";
import { FaHeart } from "react-icons/fa";
import { Button, Modal } from "antd";
import ModalSelectSize from "../modals/ModalSelectSize";
import ModalSelectSizeFavorite from "../modals/ModalSelectSizeFavorite";
import { useNavigate } from "react-router-dom";
import {
  ClockCircleFilled,
  DownOutlined,
  SearchOutlined,
  WarningFilled,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import { removeFromFavorites } from "../../services/favoriteService";
const FavoriteItem = (props) => {
  const { item, key, onUpdate } = props;
  const navigate = useNavigate();
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      openModalSelectSize: false,
      openModalRemove: false,
    }
  );
  const handleShowModalSelectSize = useCallback(() => {
    setLocalState({
      type: "openModalSelectSize",
      payload: true,
    });
  }, []);
  const handleOnCloseModalSelectSize = useCallback(() => {
    setLocalState({
      type: "openModalSelectSize",
      payload: false,
    });
  }, []);
  const handleOpenModalRemove = useCallback(() => {
    setLocalState({
      type: "openModalRemove",
      payload: true,
    });
  }, []);
  const handleCancelModal = useCallback(() => {
    setLocalState({
      type: "openModalRemove",
      payload: false,
    });
  }, []);
  const handleRemoveFromFavorite = useCallback(async () => {
    try {
      const res = await removeFromFavorites(item?.id);
      if (res?.statusCode === 200) {
        toast.success("Remove from favorite success");
        setLocalState({
          type: "openModalRemove",
          payload: false,
        });
        onUpdate();
      }
    } catch (error) {
      console.error(error);
      toast.error("Remove from favorite failed");
    }
  }, []);
  return (
    <>
      <div
        key={key}
        className="col-span-4 mb-3 flex flex-col justify-center gap-1"
      >
        <div className="relative w-full">
          <img
            src={getImageByCloudinary(item?.product?.productImage)}
            alt=""
            className="w-full cursor-pointer"
            onClick={() =>
              navigate(`/detail-product/${item?.product?.productParentId}`)
            }
          />
          <span
            className="absolute top-3 right-3 rounded-full p-4 bg-white cursor-pointer"
            onClick={handleOpenModalRemove}
          >
            <FaHeart className="text-lg text-red-500" />
          </span>
        </div>
        <div className="flex justify-between mt-1">
          <div className="text-lg font-semibold text-neutral-700 line-clamp-1 text-ellipsis">
            {item?.product?.productName}
          </div>
        </div>
        <span className="font-semibold text-neutral-500">
          {item?.product?.categoryWithObjectName}
        </span>
        <div className="flex items-center gap-2">
          {item?.product?.salePrice === 0 && (
            <span className="text-lg font-semibold text-neutral-700">
              {item?.product?.price?.toLocaleString("vi-vn")} VNĐ
            </span>
          )}
          {item?.product?.salePrice > 0 && (
            <>
              <span className="text-lg font-semibold text-neutral-700">
                {item?.product?.salePrice?.toLocaleString("vi-vn")} VNĐ
              </span>
              <span className="text-sm font-semibold text-neutral-700 line-through">
                {item?.product?.price?.toLocaleString("vi-vn")} VNĐ
              </span>
            </>
          )}
        </div>
        <div className="w-fit  mt-3">
          <Button
            className="rounded-full text-base font-semibold px-8"
            size="large"
            onClick={handleShowModalSelectSize}
            disabled={
              item?.product?.sizes?.length === 0 || item?.product?.stock === 0
            }
          >
            {item?.product?.stock > 0 ? "Select Size" : "Out of stock"}
          </Button>
        </div>
      </div>
      <ModalSelectSizeFavorite
        item={item}
        open={localState?.openModalSelectSize}
        onClose={handleOnCloseModalSelectSize}
      />
      <Modal
        title={
          <span className="text-2xl">
            <WarningFilled className="text-yellow-400" /> Remove Item
          </span>
        }
        open={localState?.openModalRemove}
        onCancel={handleCancelModal}
        onOk={handleRemoveFromFavorite}
        okButtonProps={{ className: "bg-primary text-white hover:opacity-80" }}
        cancelButtonProps={{
          className:
            "bg-white text-primary hover:bg-secondary hover:text-white hover:border-secondary",
        }}
        okText="Accept"
        cancelText="Cancel"
      >
        <p className="text-lg">
          Are you sure you want to delete this product from your Favorite?
        </p>
      </Modal>
    </>
  );
};

export default memo(FavoriteItem);
