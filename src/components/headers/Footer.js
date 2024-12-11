import React, { memo } from "react";
import { FaInstagram } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="w-full border-t-[1px] bg-neutral-50 flex justify-center items-center py-20 gap-4 mt-20">
      <div className="flex items-center gap-4 text-3xl">
        <span className="cursor-pointer hover:text-red-500">
          <FaInstagram />
        </span>
        <span className="cursor-pointer hover:text-red-500">
          <FaFacebookSquare />
        </span>
        <span className="cursor-pointer hover:text-red-500">
          <FaSquareTwitter />
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-lg font-semibold text-neutral-700">
          © 2024 Hamans
        </span>
        <span className="text-lg font-semibold text-neutral-700 cursor-pointer hover:text-red-500">
          Privacy Policy
        </span>
        <span className="text-lg font-semibold text-neutral-700 cursor-pointer hover:text-red-500">
          Terms of Service
        </span>
      </div>
    </div>
  );
};

export default memo(Footer);
