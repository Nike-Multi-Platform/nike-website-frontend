import { Button, List, message, Modal } from "antd";
import React, { memo, useCallback, useRef, useState } from "react";
import VirtualList from "rc-virtual-list";
import ModalReviewItem from "./ModalReviewItem";
import { writeReview } from "../../services/orderService";

const ModalWriteReview = (props) => {
  const { order, openModal, onClose, onUpdate } = props;

  const [resetTrigger, setResetTrigger] = useState(false);
  const reviewsRef = useRef([]);
  const validateRef = useRef([]);
  const handleCloseModalReview = useCallback(() => {
    setResetTrigger((prev) => !prev);
    onClose();
    reviewsRef.current = [];
    validateRef.current = [];
  }, [onClose]);

  const handleConfirmReview = useCallback(async () => {
    const tempValidate = [];
    if (reviewsRef.current.length === 0) {
      message.warning("Please rate the product");
      return;
    }
    reviewsRef.current.forEach((review, index) => {
      const errors = {};
      if (review.rating === 0) {
        errors.rating = "Please rate the product";
      }
      if (review.review === "") {
        errors.review = "Please enter review";
      } else if (review.review.length < 30) {
        errors.review = "Reviews must be 30 characters or longer";
      } else if (review.review.length > 120) {
        errors.review = "Reviews must be 120 characters or less";
      }

      if (review.title === "") {
        errors.title = "Please enter title";
      } else if (review.title.length < 5) {
        errors.title = "Title must be 5 characters or longer";
      } else if (review.title.length > 50) {
        errors.title = "Title must be 50 characters or less";
      }

      if (Object.keys(errors).length > 0) {
        tempValidate[index] = errors;
      }
    });
    console.log("tempValidate", tempValidate);
    if (tempValidate.length > 0) {
      validateRef.current = tempValidate;
      message.warning(tempValidate[0]?.review);
      return;
    }
    console.log("reviewsRef.current", reviewsRef.current);
    validateRef.current = [];
    try {
      const payload = {
        userId: order?.userId,
        userOrderId: order?.userOrderId,
        reviews: reviewsRef.current,
      };
      const res = await writeReview(payload);
      if (res.statusCode === 200) {
        message.success("Review product successfully");
        onUpdate();
        handleCloseModalReview();
      }
    } catch (error) {
      message.error("An error occurred, please try again later");
    }
  }, []);
  return (
    <Modal
      title={
        <span className="text-2xl font-semibold capitalize">
          Write a review
        </span>
      }
      open={openModal}
      closable={false}
      width={800}
      onCancel={handleCloseModalReview}
      onClose={handleCloseModalReview}
      footer={
        <div className="w-full flex justify-end items-center gap-3">
          <Button size="large" onClick={handleCloseModalReview}>
            Cancel
          </Button>
          <Button
            size="large"
            className="text-white bg-orange-500 border-orange-500 hover:opacity-80"
            onClick={handleConfirmReview}
          >
            Done
          </Button>
        </div>
      }
    >
      <List>
        <VirtualList data={order?.userOrderItems} itemHeight={400} height={650}>
          {(item, index) => (
            <List.Item>
              <ModalReviewItem
                item={item}
                resetTrigger={resetTrigger}
                onSave={(data) => (reviewsRef.current[index] = data)}
                validateRef={validateRef.current[index]}
              />
            </List.Item>
          )}
        </VirtualList>
      </List>
    </Modal>
  );
};

export default memo(ModalWriteReview);
