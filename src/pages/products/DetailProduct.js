import React, { useEffect, useLayoutEffect, useReducer } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getColorDetail,
  getColorReviews,
  getDetailProduct,
} from "../../services/productParentServices";

import { getImageByCloudinary } from "../../helpers/getImageByCloudinary";
import {
  Button,
  Image,
  List,
  Pagination,
  Result,
  Select,
  Spin,
  notification,
} from "antd";
import { FaRulerHorizontal } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import ReviewItemCard from "../../components/reviews/reviewItemCard";
import RecommendationCarousel from "../../components/products/RecommendationCarousel";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToBag } from "../../services/bagService";
import { addToFavorites } from "../../services/favoriteService";
import { fetchTotalItems } from "../../redux/cartSlice";
const DetailProduct = () => {
  const product_parent_id = useParams().product_parent_id;
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      loading: false,
      reviews: {
        data: [],
        totalPages: 0,
      },
      product: null,
      currentColor: null,
      currentSize: null,
      currentThumbnail: null,
      salePercent: 0,
      filter: {
        rating: 6,
        sortBy: "newest",
      },
      page: 1,
    }
  );
  const location = useLocation();
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100); // Delay 100ms để đảm bảo trang đã tải xong
  }, [location]);

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
        // console.log(res.data);
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
  useEffect(() => {
    if (localState.product) {
      const firstInStock = localState.product.products?.find(
        (x) => x.stock > 0
      );

      if (!firstInStock) {
        fetchColorDetail(localState.product.products[0]?.productId);
      } else {
        fetchColorDetail(firstInStock?.productId);
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
        localState.currentColor?.salePrice === 0
          ? localState.product?.productPrice
          : localState.currentColor?.salePrice;
      const salePercent = Math.round(
        ((localState.product?.productPrice - salePrice) /
          localState.product?.productPrice) *
          100
      );
      setLocalState({
        type: "salePercent",
        payload: salePercent,
      });
    }
  }, [localState.product, localState.currentColor]);

  useEffect(() => {
    const fetchReviews = async () => {
      setLocalState({
        type: "loading",
        payload: true,
      });
      try {
        const res = await getColorReviews(
          localState.currentColor?.productId,
          localState.page,
          10,
          localState.filter.sortBy,
          localState.filter.rating
        );

        setLocalState({
          type: "reviews",
          payload: {
            data: res.data,
            totalPages: res.totalPages,
          },
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
    if (localState.currentColor && localState.filter && localState.page) {
      fetchReviews();
    }
  }, [localState.currentColor, localState.filter, localState.page]);

  const addToCart = async () => {
    if (!user?.userId) {
      toast.error("Please login to add to bag");
      navigate("/login");
      return;
    }
    try {
      const res = await addToBag(
        user?.userId,
        localState.currentSize?.productSizeId,
        1
      );
      console.log(res?.data);
      if (res?.data === true) {
        notification.success({
          message: res?.message,
          showProgress: true,
          pauseOnHover: false,
        });
        dispatch(fetchTotalItems(user?.userId));
      } else {
        console.log(res?.message);
        notification.error({
          message: res?.message,
          showProgress: true,
          pauseOnHover: false,
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: error?.message,
        showProgress: true,
        pauseOnHover: false,
      });
    }
  };

  const addToWishList = async () => {
    if (!user?.userId) {
      toast.error("Please login to add to your wish list");
      navigate("/login");
      return;
    }
    try {
      const res = await addToFavorites(
        user?.userId,
        localState.currentColor?.productId
      );
      console.log(res?.data);
      if (res?.data === true) {
        notification.success({
          message: res?.message,
          showProgress: true,
          pauseOnHover: false,
        });
      } else {
        console.log(res?.message);
        notification.error({
          message: res?.message,
          showProgress: true,
          pauseOnHover: false,
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: error?.message,
        showProgress: true,
        pauseOnHover: false,
      });
    }
  };

  return (
    <>
      {/* {localState.loading && (
        <div className="max-w-[1400px] h-[400px] mx-auto items-center justify-center">
          <Spin />
        </div>
      )} */}
      {localState.product && (
        <>
          <div className="max-w-[1100px] mx-auto grid grid-cols-12 my-10 gap-3">
            <div className="col-span-7 flex gap-3 max-h-[552px]">
              <div className="pl-3 custom-scrollbar max-h-[552px] flex flex-col gap-2">
                {Array.isArray(localState.currentColor?.productImageDtos) &&
                  localState.currentColor?.productImageDtos?.map(
                    (img, index) => (
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
                    )
                  )}
              </div>
              <Image
                src={getImageByCloudinary(
                  localState.currentThumbnail?.imageFileName,
                  552,
                  552
                )}
                className="rounded-md max-h-[552px]"
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
                {((localState.product?.registerFlashSaleProduct &&
                  localState.product?.registerFlashSaleProduct?.quantity -
                    localState.product?.registerFlashSaleProduct?.sold ===
                    0) ||
                  localState.product?.registerFlashSaleProduct === null) &&
                  localState.currentColor?.salePrice === 0 && (
                    <span className="font-nike text-body1 font-semibold text-lg text-neutral-700">
                      {localState.product?.productPrice.toLocaleString(
                        "vi-VN"
                      ) + " VNĐ"}
                    </span>
                  )}

                {((localState.product?.registerFlashSaleProduct &&
                  localState.product?.registerFlashSaleProduct?.quantity -
                    localState.product?.registerFlashSaleProduct?.sold ===
                    0) ||
                  localState.product?.registerFlashSaleProduct === null) &&
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
                {localState.product?.registerFlashSaleProduct &&
                  localState.product?.registerFlashSaleProduct?.quantity -
                    localState.product?.registerFlashSaleProduct?.sold >
                    0 && (
                    <>
                      <span className="font-nike text-lg text-body1 font-semibold text-neutral-700 ">
                        {localState?.product?.registerFlashSaleProduct?.flashSalePrice.toLocaleString(
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
              </div>
              <div className="gap-2 flex flex-wrap overflow-y-auto max-h-[160px] mt-7">
                {Array.isArray(localState.product?.products) &&
                  localState.product?.products?.length > 0 &&
                  localState.product?.products?.map((img, key) => (
                    <img
                      src={getImageByCloudinary(img.productImage, 70, 70)}
                      loading="lazy"
                      key={key}
                      className={`${
                        img?.productId === localState.currentColor?.productId
                          ? "border-[1px] border-red-500 shadow-lg"
                          : ""
                      } cursor-pointer rounded-md`}
                      alt=""
                      onClick={() => fetchColorDetail(img.productId)}
                    />
                  ))}
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <div className="flex justify-between text-neutral-700">
                  <span className="font-semibold">Select Size</span>
                  <span className="flex items-center gap-2 cursor-pointer">
                    <FaRulerHorizontal /> Size Guide
                  </span>
                </div>
                <div className="grid grid-cols-12 items-center gap-3">
                  {Array.isArray(localState.currentColor?.productSizeDtos) &&
                    localState.currentColor?.productSizeDtos?.length > 0 &&
                    localState.currentColor?.productSizeDtos?.map(
                      (size, key) => (
                        <Button
                          className={`col-span-3 hover:bg-red-500 hover:text-white hover:border-red-500 font-semibold ${
                            size.productSizeId ===
                            localState.currentSize?.productSizeId
                              ? "bg-red-500 text-white border-red-500"
                              : ""
                          } rounded-md`}
                          key={key}
                          disabled={size.quantity <= 0}
                          onClick={() =>
                            setLocalState({
                              type: "currentSize",
                              payload: size,
                            })
                          }
                        >
                          {size?.sizeDto?.sizeName}
                        </Button>
                      )
                    )}
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4 px-6">
                {localState.currentSize?.quantity > 0 ? (
                  <>
                    <Button
                      className="rounded-full h-12 bg-red-500 border-red-500 text-white hover:opacity-80 font-semibold"
                      onClick={() => addToCart()}
                    >
                      Add To Bag
                    </Button>
                    <Button
                      className="rounded-full h-12 font-semibold hover:bg-black hover:text-white hover:border-black"
                      onClick={() => addToWishList()}
                    >
                      Favourite <FaRegHeart />
                    </Button>
                  </>
                ) : (
                  <Button
                    className="rounded-full h-12 bg-red-500 border-red-500 text-white hover:opacity-80 font-semibold"
                    disabled={true}
                  >
                    Sold Out
                  </Button>
                )}
              </div>
            </div>
            <div className="col-span-12 mt-2">
              <div className="w-full  bg-zinc-100">
                <div className="font-semibold text-neutral-700 rounded p-4">
                  Description
                </div>
              </div>
              <div className="flex flex-col gap-4 text-neutral-700 border-[1px] p-2 rounded">
                <span className="whitespace-pre-line font-semibold">
                  {localState.currentColor?.moreInfo}
                </span>
                <ul className="list-disc pl-5 font-semibold">
                  {localState.currentColor?.colorShown &&
                    localState.currentColor?.colorShown !== "" && (
                      <li>
                        Colour Shown: {localState.currentColor?.colorShown}
                      </li>
                    )}

                  {localState.currentColor?.styleCode &&
                    localState.currentColor?.styleCode !== "" && (
                      <li>Style Code: {localState.currentColor?.styleCode}</li>
                    )}
                  {localState.currentColor?.sizeAndFit &&
                    localState.currentColor?.sizeAndFit !== "" && (
                      <li>
                        Size And Fit: {localState.currentColor?.sizeAndFit}
                      </li>
                    )}
                </ul>
              </div>
            </div>
            <div className="col-span-12 mt-2">
              <div className="w-full p-4  bg-red-500 flex justify-between items-center">
                <div className="font-semibold text-white rounded ">Reviews</div>
              </div>
              <div className="mt-2 mb-2">
                <div className="flex gap-2 items-center">
                  <Select
                    options={[
                      { label: "All Ratings", value: 6 },
                      { label: "5 Stars", value: 5 },
                      { label: "4 Stars", value: 4 },
                      { label: "3 Stars", value: 3 },
                      { label: "2 Stars", value: 2 },
                      { label: "1 Star", value: 1 },
                    ]}
                    defaultValue={localState.filter.rating}
                    size="large"
                    onChange={(value) =>
                      setLocalState({
                        type: "filter",
                        payload: {
                          ...localState.filter,
                          rating: value,
                        },
                      })
                    }
                  />
                  <Select
                    options={[
                      { label: "Newest", value: "newest" },
                      { label: "Oldest", value: "oldest" },
                      { label: "Highest Rating", value: "highest-rating" },
                      { label: "Lowest Rating", value: "lowest-rating" },
                    ]}
                    defaultValue={localState.filter.sortBy}
                    size="large"
                    onChange={(value) =>
                      setLocalState({
                        type: "filter",
                        payload: {
                          ...localState.filter,
                          sortBy: value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <List
                dataSource={localState.reviews?.data}
                loading={localState.loading}
                renderItem={(item, key) => (
                  <List.Item key={key}>
                    <ReviewItemCard review={item} />
                  </List.Item>
                )}
              />
              <Pagination
                className="mt-4"
                align="center"
                defaultCurrent={localState.page}
                total={localState.reviews.totalPages * 10}
                showSizeChanger={false}
                onChange={(page, pageSize) =>
                  setLocalState({
                    type: "page",
                    payload: page,
                  })
                }
                pageSize={10}
                hideOnSinglePage={
                  localState.reviews?.data?.length <= 10 ? true : false
                }
                current={localState.page}
              />
            </div>
          </div>
          <div className="max-w-[1400px] mx-auto my-8">
            <RecommendationCarousel />
          </div>
        </>
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
