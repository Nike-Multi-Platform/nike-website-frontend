import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { getImageByCloudinary } from "../../helpers/getImageByCloudinary";
import {
  Button,
  Checkbox,
  Image,
  InputNumber,
  message,
  Modal,
  notification,
  Statistic,
} from "antd";
import {
  getSizes,
  removeFromBag,
  updateQuantity,
  updateSelectedBagItem,
} from "../../services/bagService";
import { useDispatch, useSelector } from "react-redux";
import { fetchBag } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { MdFavoriteBorder } from "react-icons/md";
import toast from "react-hot-toast";
import { addToFavorites } from "../../services/favoriteService";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  ClockCircleFilled,
  DownOutlined,
  SearchOutlined,
  WarningFilled,
} from "@ant-design/icons";
import ModalSelectSize from "../modals/ModalSelectSize";
const { Countdown } = Statistic;
const CartItem = (props) => {
  const { item, key, type = "valid" } = props;
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      selected: false,
      openModal: false,
      openModalSelectSize: false,
    }
  );
  useEffect(() => {
    setLocalState({
      type: "selected",
      payload: item?.is_selected,
    });
  }, [item?.is_selected]);
  const handleCheckboxChange = useCallback(
    async (e) => {
      const isChecked = e.target.checked;
      try {
        const res = await updateSelectedBagItem(item?.bagId, isChecked);
        notification.success({
          message: res?.message,
          showProgress: true,
          pauseOnHover: false,
        });
        dispatch(fetchBag(user?.userId));
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch, item?.bagId, user?.userId]
  );
  const handleUpdateQuantity = useCallback(async (value) => {
    const quantityValue = parseInt(value, 10);
    if (quantityValue !== 0) {
      try {
        const res = await updateQuantity(item?.bagId, quantityValue);
        console.log("res", res);
        if (res?.statusCode === 200) {
          if (user?.userId !== "") {
            dispatch(fetchBag(user?.userId));
          }
        }
      } catch (error) {
        //   console.log("Lỗi khi cập nhật số lượng sản phẩm: ", error);
        //   message.error(
        //     error?.message || "Cập nhật số lượng sản phẩm thất bại"
        //   );
        notification.error({
          message: error?.message || "Update quantity failed",
          showProgress: true,
          pauseOnHover: false,
        });
      }
    } else {
      handleShowModal();
    }
  }, []);

  const handleViewProduct = useCallback(() => {
    navigate(`/detail-product/${item?.details?.productParentId}`);
  }, []);

  const handleAddToWishlist = useCallback(async () => {
    if (!user?.userId) {
      toast.error("Please login to add to your wish list");
      navigate("/login");
      return;
    }
    try {
      const res = await addToFavorites(user?.userId, item?.details?.productId);
      console.log(res?.data);
      if (res?.data === true) {
        notification.success({
          message: res?.message,
          showProgress: true,
          pauseOnHover: false,
        });
      } else {
        console.log(res?.message);
        notification.error({
          message: res?.message,
          showProgress: true,
          pauseOnHover: false,
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: error?.message,
        showProgress: true,
        pauseOnHover: false,
      });
    }
  }, [item?.details?.productId, navigate, user?.userId]);

  const handleRemoveFromCart = useCallback(async () => {
    try {
      const res = await removeFromBag(item?.bagId);
      if (res?.statusCode === 200) {
        if (user?.userId !== "") {
          dispatch(fetchBag(user?.userId));
          notification.success({
            message: res?.message,
            showProgress: true,
            pauseOnHover: false,
          });
        }
      }
    } catch (error) {
      console.error("Error when removing item from cart", error);
      notification.error({
        message: error?.message,
        showProgress: true,
        pauseOnHover: false,
      });
    } finally {
      setLocalState({
        type: "openModal",
        payload: false,
      });
    }
  }, [dispatch, item?.bagId, user?.userId]);
  const handleCancelModal = () => {
    setLocalState({
      type: "openModal",
      payload: false,
    });
  };
  const handleShowModal = () => {
    setLocalState({
      type: "openModal",
      payload: true,
    });
  };
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
  const totalPrice = useMemo(() => {
    return item?.details?.finalPrice * item?.amount;
  }, [item?.details?.finalPrice, item?.amount]);
  return (
    <>
      <div key={key} className="w-full grid grid-cols-12">
        {type === "valid" && (
          <div className="col-span-1 flex justify-between items-center">
            <Checkbox
              checked={localState?.selected}
              onChange={handleCheckboxChange}
            />
          </div>
        )}

        <div
          className={`${
            type === "valid" ? "col-span-3" : "col-span-4"
          } flex items-center justify-center cursor-pointer`}
        >
          <img
            src={getImageByCloudinary(item?.details?.productImage)}
            alt=""
            className="size-28"
            onClick={handleViewProduct}
          />
        </div>
        <div className="col-span-8 flex flex-col h-full relative">
          <div
            className="flex justify-between cursor-pointer"
            onClick={handleViewProduct}
          >
            <div className="font-semibold w-[300px] text-ellipsis line-clamp-1">
              {item?.details?.productName}
            </div>
            <div className="font-semibold">
              {totalPrice?.toLocaleString("vi-VN") + " VNĐ"}
            </div>
          </div>
          <div className="text-neutral-500">
            {item?.details?.categoryWithObjectName}
          </div>
          <div className="text-neutral-500 mb-2">
            <span>Size </span>
            <span
              className="font-semibold underline cursor-pointer"
              onClick={handleShowModalSelectSize}
            >
              {item?.productSizeName}
            </span>
          </div>
          <div className="w-full absolute bottom-0">
            <div className="flex justify-between items-center">
              <InputNumber
                prefix="Qty: "
                min={0}
                max={item?.details?.stock}
                defaultValue={item?.amount}
                value={item?.amount}
                onChange={handleUpdateQuantity}
              />
              <div className="flex items-center gap-2">
                <span
                  className="p-2  rounded-full border-[1px] hover:bg-orange-500 hover:text-white cursor-pointer"
                  onClick={handleAddToWishlist}
                >
                  <MdFavoriteBorder />
                </span>
                <span
                  className="p-2  rounded-full border-[1px] hover:bg-orange-500 hover:text-white cursor-pointer"
                  onClick={handleShowModal}
                >
                  <FaRegTrashAlt />
                </span>
              </div>
            </div>
          </div>
        </div>
        {type === "valid" && (
          <div className="col-span-12 flex justify-between mt-4">
            {item?.registerFlashSaleProduct && (
              <>
                <div className="w-fit pl-16 text-orange-500 flex gap-2 items-center">
                  <ClockCircleFilled /> Flash Sale will ended in{" "}
                  <Countdown
                    valueStyle={{
                      color: "#ff4d4f",
                      fontSize: "18px",
                      fontWeight: 500,
                    }}
                    onFinish={() => {
                      message.warning("Flash Sale ended!");
                      dispatch(fetchBag(user?.userId));
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
              </>
            )}
          </div>
        )}
      </div>
      <Modal
        title={
          <span className="text-2xl">
            <WarningFilled className="text-yellow-400" /> Remove Item
          </span>
        }
        open={localState?.openModal}
        onCancel={handleCancelModal}
        onOk={handleRemoveFromCart}
        okButtonProps={{ className: "bg-primary text-white hover:opacity-80" }}
        cancelButtonProps={{
          className:
            "bg-white text-primary hover:bg-secondary hover:text-white hover:border-secondary",
        }}
        okText="Accept"
        cancelText="Cancel"
      >
        <p className="text-lg">Are you sure you want to delete this product?</p>
      </Modal>
      <ModalSelectSize
        item={item}
        type="update"
        open={localState?.openModalSelectSize}
        onClose={handleOnCloseModalSelectSize}
      />
    </>
  );
};

export default memo(CartItem);
