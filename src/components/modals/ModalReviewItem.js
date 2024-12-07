import { Input, Rate } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { memo, useCallback, useEffect, useReducer } from "react";
import { getImageByCloudinary } from "../../helpers/getImageByCloudinary";
import { title } from "framer-motion/client";
const desc = ["Bad", "Not Satisfied", "Normal", "Satisfied", "Great"];
const ModalReviewItem = (props) => {
  const { item, resetTrigger, onSave, validateRef } = props;

  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "title": {
          return { ...state, title: action.payload };
        }
        case "rating":
          return { ...state, rating: action.payload };
        case "review":
          return { ...state, review: action.payload };
        case "error":
          return { ...state, error: action.payload };
        default:
          return state;
      }
    },
    {
      rating: 5,
      review: "",
      title: "",
      error: {
        review: "",
        rating: "",
        title: "",
      },
    }
  );

  const handleViewProduct = () => {
    window.location.href = `/detail-product/${item?.productId}`;
  };

  const handleRating = useCallback((value) => {
    setLocalState({ type: "rating", payload: value });
  }, []);
  const handleOnTextAreaChange = useCallback((e) => {
    const value = e.target.value;
    setLocalState({ type: "review", payload: value });
  }, []);

  const handleOnTitleChange = useCallback((e) => {
    const value = e.target.value;
    setLocalState({ type: "title", payload: value });
  }, []);

  useEffect(() => {
    if (resetTrigger) {
      setLocalState({ type: "rating", payload: 5 });
      setLocalState({ type: "review", payload: "" });
      setLocalState({ type: "title", payload: "" });
    }
  }, [resetTrigger]);

  useEffect(() => {
    onSave({
      productId: item?.productId,
      rating: localState.rating,
      review: localState.review,
      title: localState.title,
      sizeName: item?.sizeName,
    });
  }, [
    item?.productId,
    item?.sizeName,
    localState.rating,
    localState.review,
    localState.title,
    onSave,
  ]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div
        className="flex gap-2 rounded-lg border-[1px] cursor-pointer"
        onClick={handleViewProduct}
      >
        <img
          src={getImageByCloudinary(item?.thumbnail)}
          alt=""
          className="size-40 rounded-tl-lg rounded-bl-lg"
        />
        <div className="w-full flex-1 flex flex-col gap-1">
          <span className="text-lg font-semibold">{item?.productName}</span>
          <span className="font-semibold text-neutral-600">
            {item?.price?.toLocaleString("vi-vn")} VNĐ{" "}
            <span className="text-neutral-500 text-sm">x{item?.amount}</span>
          </span>
          <span className="font-semibold">{item?.sizeName}</span>
        </div>
      </div>
      <div className="flex justify-start items-center gap-5">
        <span className="font-semibold text-lg text-neutral-500">
          Product quality
        </span>
        <Rate
          className="text-[40px]"
          value={localState.rating}
          onChange={handleRating}
        />
        <span
          className={`text-xl ${
            localState.rating >= 3 ? "text-primary" : "text-red-700"
          } `}
        >
          {localState.rating ? desc[localState.rating - 1] : ""}
        </span>
      </div>
      <span className="text-red-500">{validateRef?.rating}</span>
      <Input
        placeholder="Title"
        className="text-lg"
        status={
          (validateRef?.title.length > 0 || localState.title > 50) && "error"
        }
        value={localState.title}
        onChange={handleOnTitleChange}
      />
      <span className="text-red-500">{validateRef?.title}</span>
      <TextArea
        autoSize={{
          minRows: 8,
          maxRows: 12,
        }}
        count={{
          show: true,
          max: 120,
        }}
        status={
          (validateRef?.review.length > 0 || localState.review > 120) && "error"
        }
        value={localState.review}
        onChange={handleOnTextAreaChange}
        className="text-lg"
        placeholder="Please share what you like about other buyers."
      />
      <span className="text-red-500">{validateRef?.review}</span>
    </div>
  );
};

export default memo(ModalReviewItem);
