import { Menu } from "antd";
import React, { memo, useState } from "react";
import { BiCloset } from "react-icons/bi";
import { CgClose } from "react-icons/cg";

const DrawerMenuContent = (props) => {
  return (
    <div className="w-full max-w-full flex flex-col gap-3">
      <span className="text-[50px] cursor-pointer">
        <CgClose />
      </span>
      <div className=""></div>
    </div>
  );
};

export default memo(DrawerMenuContent);
