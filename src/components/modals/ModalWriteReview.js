import { Modal } from "antd";
import React, { memo } from "react";

const ModalWriteReview = (props) => {
  const { order, openModal, onClose } = props;
  return (
    <Modal
      width={800}
      open={openModal}
      onClose={onClose}
      onCancel={onClose}
      title={<span className="text-2xl">Write Reviews</span>}
    ></Modal>
  );
};

export default memo(ModalWriteReview);
