import { Carousel } from "antd";
import React, { memo, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { getImageByCloudinary } from "../../helpers/getImageByCloudinary";
import ProductFlashSaleCard from "./ProductFlashSaleCard";
import { getRecommendProducts } from "../../services/productParentServices";
import ProductCard from "./ProductCard";

const RecommendationCarousel = () => {
  const user = useSelector((state) => state.user);
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      loading: false,
      recommendProducts: [],
    }
  );
  useEffect(() => {
    const fetchRecommendProducts = async () => {
      setLocalState({
        type: "loading",
        payload: true,
      });
      try {
        const res = await getRecommendProducts(user?.userId, 8);
        setLocalState({
          type: "recommendProducts",
          payload: res.data,
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
    fetchRecommendProducts();
  }, [user]);
  return (
    <div className="w-full flex flex-col gap-4 mt-5">
      <span className="font-nike  uppercase text-2xl font-semibold">
        You Might Also Like
      </span>
      <Carousel
        arrows
        rows={1}
        slidesToShow={4}
        className={`container-carousel ${
          localState.recommendProducts?.products?.length < 4
            ? "not-enough-slide"
            : ""
        }`}
        infinite={false}
        dots={false}
        centerMode={false}
        focusOnSelect={true}
      >
        {Array.isArray(localState.recommendProducts) &&
          localState.recommendProducts?.map((product, key) => (
            <ProductCard key={key} product={product} />
          ))}
      </Carousel>
    </div>
  );
};

export default memo(RecommendationCarousel);
