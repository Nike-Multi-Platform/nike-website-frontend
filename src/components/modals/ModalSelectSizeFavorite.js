import { Button, Image, Modal } from "antd";
import React, { memo, useCallback, useEffect, useReducer } from "react";
import { getImageByCloudinary } from "../../helpers/getImageByCloudinary";
import toast from "react-hot-toast";
import { fetchBag } from "../../redux/cartSlice";
import { addToBag, getSizes } from "../../services/bagService";
import { useDispatch, useSelector } from "react-redux";

const ModalSelectSizeFavorite = (props) => {
  const { item, open, onClose } = props;
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      sizes: [],
      openModalSelectSize: false,
      currentSize: null,
    }
  );
  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const res = await getSizes(item?.product?.productId);
        if (res?.statusCode === 200) {
          setLocalState({
            type: "sizes",
            payload: res?.data,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (open) {
      fetchSizes();
    }
  }, [item?.product?.productId, open]);
  const handleAddToBag = useCallback(async () => {
    try {
      const res = await addToBag(user?.userId, localState?.currentSize, 1);
      if (res?.statusCode === 200) {
        onClose();
        toast.success(res?.message);
        dispatch(fetchBag(user?.userId));
      }
    } catch (error) {
      console.error(error);
      toast.terror("Add to bag failed");
    }
  }, [localState?.currentSize, onClose, user?.userId]);
  const handleSubmit = useCallback(async () => {
    await handleAddToBag();
  }, [handleAddToBag]);
  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      width={940}
      onClose={onClose}
      onCancel={onClose}
    >
      <div className="grid grid-cols-12">
        <div className="col-span-6">
          <Image
            src={getImageByCloudinary(item?.product?.productImage)}
            className="size-[432px] rounded"
          />
        </div>
        <div className="col-span-6 relative">
          <div className="mb-5">
            <p className="font-semibold text-lg">
              {item?.product?.categoryWithObjectName}
            </p>
            <p className="font-semibold text-2xl line-clamp-1 text-ellipsis w-full">
              {item?.product?.productName}
            </p>
            <p className="font-bold text-lg">
              {item?.product?.finalPrice?.toLocaleString("vi-VN") + " VNĐ"}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold">Select Size</span>
            <div className="w-full h-[192px] overflow-y-auto grid grid-cols-12 items-center gap-2 pr-2">
              {localState?.sizes?.map((size, index) => (
                <Button
                  key={index}
                  disabled={
                    size?.quantity < 1 ||
                    size?.productSizeId === item?.product_size_id
                  }
                  className={`col-span-3 ${
                    localState?.currentSize === size.productSizeId
                      ? "bg-red-500 text-white border-red-500"
                      : ""
                  }`}
                  onClick={() =>
                    setLocalState({
                      type: "currentSize",
                      payload: size.productSizeId,
                    })
                  }
                >
                  {size?.sizeDto?.sizeName}
                </Button>
              ))}
            </div>
          </div>
          <Button
            className="absolute bottom-0 w-full rounded-full bg-red-500 text-white hover:opacity-80 border-red-500"
            size="large"
            disabled={!localState?.currentSize}
            onClick={handleSubmit}
          >
            Add to Bag
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ModalSelectSizeFavorite);
