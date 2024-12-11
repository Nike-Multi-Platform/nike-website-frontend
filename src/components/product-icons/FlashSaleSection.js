import React, { memo, useEffect, useReducer } from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import { GiFireWave } from "react-icons/gi";
import { getCurrentFlashSale } from "../../services/flashSaleServices";
import moment from "moment-timezone";
import { Carousel } from "antd";
import { getImageByCloudinary } from "../../helpers/getImageByCloudinary";
import ProductFlashSaleCard from "../products/ProductFlashSaleCard";
import { useNavigate } from "react-router-dom";

const FlashSaleSection = () => {
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      flashSales: null,
      flashSaleTime: {
        status: "waiting",
        time: null,
      },
    }
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const res = await getCurrentFlashSale(30);
        const startedAt = new Date(res.data?.startedAt); // GMT+7
        const endedAt = new Date(res.data?.endedAt); // GMT+7
        const currentTime = new Date(); // GMT+7 (local time của hệ thống)

        if (startedAt < currentTime && currentTime < endedAt) {
          setLocalState({
            type: "flashSaleTime",
            payload: {
              status: "active",
              time: endedAt,
            },
          });
        } else if (currentTime < startedAt) {
          setLocalState({
            type: "flashSaleTime",
            payload: {
              status: "waiting",
              time: startedAt,
            },
          });
        } else {
          setLocalState({
            type: "flashSaleTime",
            payload: {
              status: "ended",
              time: endedAt,
            },
          });
        }

        setLocalState({
          type: "flashSales",
          payload: res.data,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchFlashSale();
  }, []);

  return (
    <>
      {localState.flashSales?.products !== null &&
        localState.flashSales?.products.length > 0 && (
          <div className="flex flex-col gap-4 mt-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-nike  uppercase text-2xl font-semibold flex gap-2 text-red-600">
                  <GiFireWave />
                  Flash Sale
                </span>
                <span className="text-orange-800 font-semibold">
                  {localState.flashSaleTime.status === "active"
                    ? "Ends in"
                    : localState.flashSaleTime.status === "ended"
                    ? "Ended"
                    : "Starts in"}
                </span>
                <FlipClockCountdown
                  to={localState.flashSaleTime.time}
                  hideOnComplete={false}
                  labels={["HOURS", "MINUTES", "SECONDS"]}
                  labelStyle={{
                    fontSize: 10,
                    fontWeight: 500,
                    textTransform: "uppercase",
                  }}
                  className="flip-clock mt-3"
                  digitBlockStyle={{ width: 20, height: 40, fontSize: 30 }}
                  dividerStyle={{ color: "white", height: 1 }}
                  separatorStyle={{ color: "red", size: "6px" }}
                  duration={0.5}
                  renderMap={[false, true, true, true]}
                />
              </div>
              <span
                className="text-neutral-500 font-semibold cursor-pointer"
                onClick={() =>
                  navigate(
                    `/flash-sales?flashSaleTimeFrameId=${localState?.flashSales?.flashSaleTimeFrameId}`
                  )
                }
              >
                See All
              </span>
            </div>
            <Carousel
              arrows
              rows={1}
              slidesToShow={4}
              className={`container-carousel ${
                localState.flashSales?.products?.length < 4
                  ? "not-enough-slide"
                  : ""
              }`}
              infinite={false}
              dots={false}
              centerMode={false}
              focusOnSelect={true}
            >
              {Array.isArray(localState.flashSales?.products) &&
                localState.flashSales?.products.map((product, key) => (
                  <ProductFlashSaleCard
                    key={key}
                    product={product}
                    status={localState.flashSaleTime?.status}
                  />
                ))}
            </Carousel>
          </div>
        )}
    </>
  );
};

export default memo(FlashSaleSection);
