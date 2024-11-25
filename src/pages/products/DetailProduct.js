import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import {
  getColorDetail,
  getDetailProduct,
} from "../../services/productParentServices";

import { getImageByCloudinary } from "../../helpers/getImageByCloudinary";
import { Image, Result, Spin } from "antd";

const DetailProduct = () => {
  const product_parent_id = useParams().product_parent_id;
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      loading: false,
      product: null,
      currentColor: null,
      currentSize: null,
      currentThumbnail: null,
      salePercent: 0,
    }
  );

  useEffect(() => {
    const fetchProduct = async () => {
      setLocalState({
        type: "loading",
        payload: true,
      });
      try {
        const res = await getDetailProduct(product_parent_id);
        setLocalState({
          type: "product",
          payload: res.data,
        });
        console.log(res.data);
      } catch (error) {
        setLocalState({
          type: "loading",
          payload: false,
        });
      }
    };
    if (product_parent_id) {
      fetchProduct();
    }
  }, [product_parent_id]);
  useEffect(() => {
    const fetchColorDetail = async (productId) => {
      setLocalState({
        type: "loading",
        payload: true,
      });
      try {
        const res = await getColorDetail(productId);
        setLocalState({
          type: "currentColor",
          payload: res.data,
        });
        const firstThumbnail = res.data.productImageDtos[0];
        setLocalState({
          type: "currentThumbnail",
          payload: firstThumbnail,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLocalState({
          type: "loading",
          payload: false,
        });
      }
    };
    if (localState.product) {
      const firstInStock = localState.product.products?.find(
        (x) => x.stock > 0
      );

      if (!firstInStock) {
        fetchColorDetail(localState.product.products[0].productId);
      } else {
        fetchColorDetail(firstInStock.productId);
      }
    }
  }, [localState.product]);

  useEffect(() => {
    if (localState.currentColor) {
      const firstSizeInStock = localState.currentColor.productSizeDtos?.find(
        (x) => x.quantity > 0
      );
      if (!firstSizeInStock) {
        setLocalState({
          type: "currentSize",
          payload: null,
        });
      } else {
        setLocalState({
          type: "currentSize",
          payload: firstSizeInStock,
        });
      }
    }
  }, [localState.currentColor]);

  useEffect(() => {
    if (localState.product && localState.currentColor) {
      const salePrice =
        localState.currentColor.salePrice === 0
          ? localState.product.productPrice
          : localState.currentColor.salePrice;
      const salePercent = Math.round(
        ((localState.product.productPrice - salePrice) /
          localState.product.productPrice) *
          100
      );
      setLocalState({
        type: "salePercent",
        payload: salePercent,
      });
    }
  }, [localState.product, localState.currentColor]);

  return (
    <>
      {localState.loading && (
        <div className="max-w-[1400px] h-[400px] mx-auto items-center justify-center">
          <Spin />
        </div>
      )}
      {localState.product && (
        <div className="max-w-[1100px] mx-auto grid grid-cols-12 my-10 gap-3">
          <div className="col-span-7 flex gap-3">
            <div className="pl-3 custom-scrollbar max-h-[552px] flex flex-col gap-2">
              {Array.isArray(localState.currentColor?.productImageDtos) &&
                localState.currentColor?.productImageDtos?.map((img, index) => (
                  <img
                    key={index}
                    loading="lazy"
                    src={getImageByCloudinary(img.imageFileName, 60, 60)}
                    className={`cursor-pointer rounded-md ${
                      localState?.currentThumbnail?.imageFileName ===
                      img.imageFileName
                        ? "shadow-lg border-[1px] border-red-500"
                        : ""
                    }`}
                    onClick={() => {
                      setLocalState({
                        type: "currentThumbnail",
                        payload: img,
                      });
                    }}
                    alt=""
                  />
                ))}
            </div>
            <Image
              src={getImageByCloudinary(
                localState.currentThumbnail?.imageFileName,
                552,
                552
              )}
              className="rounded-md"
              loading="lazy"
            />
          </div>
          <div className="col-span-5 flex flex-col gap-2">
            <div className="flex flex-col font-semibold">
              <div className="font-nike line-clamp-2 text-ellipsis break-words font-semibold text-2xl">
                {localState.product?.productParentName}
              </div>
              <div className="font-nike text-sm text-neutral-500">
                {localState.product?.categoryWithObjectName}
              </div>
            </div>
            <div className="flex gap-3 items-center">
              {localState.currentColor?.salePrice === 0 && (
                <span className="font-nike text-body1 font-semibold text-lg text-neutral-700">
                  {localState.product?.productPrice.toLocaleString("vi-VN") +
                    " VNĐ"}
                </span>
              )}

              {!localState.product?.registerFlashSaleProduct &&
                localState.currentColor?.salePrice !== 0 && (
                  <>
                    <span className="font-nike text-lg text-body1 font-semibold text-neutral-700 ">
                      {localState.currentColor?.salePrice.toLocaleString(
                        "vi-VN"
                      ) + " VNĐ"}
                    </span>
                    <span className="font-nike text-sm text-body1 font-semibold text-neutral-500 line-through ">
                      {localState.product?.productPrice.toLocaleString(
                        "vi-VN"
                      ) + " VNĐ"}
                    </span>
                    <span className="font-nike text-sm  p-2 rounded bg-green-500 text-white">
                      -{localState.salePercent}%
                    </span>
                  </>
                )}
              {localState.product?.registerFlashSaleProduct && (
                <>
                  <span className="font-nike text-lg text-body1 font-semibold text-neutral-700 ">
                    {localState?.product?.registerFlashSaleProduct?.flashSalePrice.toLocaleString(
                      "vi-VN"
                    ) + " VNĐ"}
                  </span>
                  <span className="font-nike text-sm text-body1 font-semibold text-neutral-500 line-through ">
                    {localState.product?.productPrice.toLocaleString("vi-VN") +
                      " VNĐ"}
                  </span>
                  <span className="font-nike text-sm  p-2 rounded bg-green-500 text-white">
                    -{localState.salePercent}%
                  </span>
                </>
              )}
            </div>
            <div className="flex overflow-auto max-h-[180px]">
              {localState.product?.products?.map((img, key) => (
                <img
                  src={getImageByCloudinary(img.productImage, 70, 70)}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {!localState.product && !localState.loading && (
        <div className="max-w-[1400px] mx-auto">
          <Result status={"error"} title="Product Not Found!" />
        </div>
      )}
    </>
  );
};

export default DetailProduct;
