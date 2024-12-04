import React, { memo, useMemo } from "react";
import { isNewRelease } from "../../helpers/isNewRelease";
import { Image } from "antd";
import { getImageByCloudinary } from "../../helpers/getImageByCloudinary";
import { useNavigate } from "react-router-dom";

const ProductCard = (props) => {
  const { product, key } = props;
  const salePrice =
    product?.registerFlashSaleProduct !== null &&
    product?.registerFlashSaleProduct?.quantity -
      product?.registerFlashSaleProduct?.sold >
      0
      ? product?.registerFlashSaleProduct?.flashSalePrice
      : product.salePrice !== null
      ? product.salePrice
      : 0;
  const salePercent = useMemo(() => {
    if (salePrice === 0) return 0;
    return Math.round(
      ((product.productPrice - salePrice) / product.productPrice) * 100
    );
  }, [salePrice, product.productPrice]);
  const newRelease = isNewRelease(product.createdAt);
  const isStock = product?.quantityInStock > 0;
  const navigate = useNavigate();
  return (
    <div
      className="col-span-3 flex flex-col hover:shadow-lg rounded-md cursor-pointer"
      onClick={
        () => navigate(`/detail-product/${product.productParentId}`)
        // (window.location.href = `/detail-product/${product.productParentId}`)
      }
      key={key}
    >
      <div className="relative">
        <Image
          src={getImageByCloudinary(product.thumbnail, 384, 384)}
          className="size-[344px]"
        />
        {(newRelease || salePercent !== 0) && (
          <div className="absolute top-0 left-0 flex gap-2">
            {newRelease && (
              <span className="rounded bg-orange-600 text-white px-2 py-1 text-xs font-nikeBody">
                New
              </span>
            )}

            {salePercent !== 0 && (
              <span className="rounded bg-green-400 text-white px-2 py-1 text-xs font-nikeBody">
                -{salePercent}%
              </span>
            )}
          </div>
        )}

        {/* {newRelease && (
          <span className="rounded absolute top-0 left-0 bg-orange-600 text-white px-2 py-1 text-xs font-nikeBody">
            New
          </span>
        )}
        {salePercent !== 0 && (
          <span className="rounded absolute top-0 left-0 bg-orange-600 text-white px-2 py-1 text-xs font-nikeBody">
            -{salePercent}%
          </span>
        )} */}
      </div>
      <div className="flex flex-col px-4 py-2 gap-1">
        <span className="font-nikeBody text-lg font-semibold text-neutral-700 line-clamp-1 text-ellipsis">
          {product.productParentName}
        </span>
        <span className="font-nikeBody text-sm text-neutral-500">
          {product.categoryWithObjectName}
        </span>
        {isStock && (
          <div className={`flex gap-2 items-center `}>
            {salePrice === 0 && (
              <span className="font-nikeBody text-body1 font-semibold text-base text-neutral-700">
                {product.productPrice.toLocaleString("vi-VN") + " VNĐ"}
              </span>
            )}

            {salePrice !== 0 && (
              <>
                <span className="font-nikeBody text-body1 font-semibold text-base text-neutral-700">
                  {salePrice?.toLocaleString("vi-VN") + " VNĐ"}
                </span>
                <span className="font-nikeBody text-sm text-body1 font-semibold text-neutral-500 line-through">
                  {product?.productPrice?.toLocaleString("vi-VN") + " VNĐ"}
                </span>
              </>
            )}
          </div>
        )}
        {!isStock && (
          <span className="font-nikeBody text-body1 font-semibold text-base text-red-600">
            Out of stock
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(ProductCard);
