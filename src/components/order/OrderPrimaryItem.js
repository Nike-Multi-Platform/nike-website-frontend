import React, { memo } from "react";

const OrderPrimaryItem = (props) => {
  const { order, key } = props;
  return <div key={key}>hehe</div>;
};

export default memo(OrderPrimaryItem);
