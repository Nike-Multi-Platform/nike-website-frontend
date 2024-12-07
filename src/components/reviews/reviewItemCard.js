import { Avatar, Rate } from "antd";
import React, { memo } from "react";
import { getImageByCloudinary } from "../../helpers/getImageByCloudinary";
import { UserOutlined } from "@ant-design/icons";
const reviewItemCard = (props) => {
  const { review } = props;
  const formattedDate = new Date(review.productReviewDate).toLocaleString();
  console.log(review);
  return (
    <div className="flex items-start gap-2">
      <div className="flex items-start justify-start">
        {review.userAccount?.userUrl && (
          <Avatar
            size={50}
            src={getImageByCloudinary(review?.userAccount?.userUrl)}
          />
        )}
        {review.userAccount?.userUrl === null && (
          <Avatar size={50} icon={<UserOutlined />} className="bg-red-500" />
        )}
      </div>
      <div className="flex flex-col justify-start gap-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-700">
            {review.userAccount?.userUsername}
          </span>
          <Rate disabled value={review.productRating} />
        </div>

        <span className="text-base font-semibold break-words">
          {review.productReviewTitle}
        </span>
        <span className="break-words">{review.productReviewContent}</span>
        <div className="flex gap-2">
          <span className="text-sm text-neutral-500">{formattedDate},</span>
          <span className="text-sm text-neutral-500">
            Size: {review.productSizeName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(reviewItemCard);
