import React, { useEffect, useReducer } from "react";
import {
  getAvailableTimeFrames,
  getFlashSaleProducts,
} from "../../services/flashSaleServices";
import { useNavigate, useParams } from "react-router-dom";
import Banner1 from "../../assets/banner1.png";
import moment from "moment-timezone";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import { ClockCircleFilled } from "@ant-design/icons";
import flashSaleIconShopee from "../../assets/flash-sale-icon-shopee.svg";
import ProductFlashSaleCard from "../../components/products/ProductFlashSaleCard";
import { GrNotes } from "react-icons/gr";
import { Button, Modal, Pagination } from "antd";
import { nav } from "framer-motion/client";
const FlashSalePage = () => {
  const query = new URLSearchParams(window.location.search);
  const flashSaleTimeFrameId =
    parseInt(query.get("flashSaleTimeFrameId")) || null;
  const page = parseInt(query.get("page")) || 1;
  const navigate = useNavigate();
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      times: [],
      time: {
        status: "ended",
        endtime: null,
      },
      products: [],
      loading: false,
      openModal: false,
      totalPages: 0,
      selectedTimeFrame: null,
    }
  );

  useEffect(() => {
    const fetchTimeFrames = async () => {
      try {
        const res = await getAvailableTimeFrames();
        setLocalState({ type: "times", payload: res.data });
        if (flashSaleTimeFrameId === null) {
          setLocalState({
            type: "selectedTimeFrame",
            payload: res.data[0].flashSaleTimeFrameId,
          });
        } else {
          setLocalState({
            type: "selectedTimeFrame",
            payload: flashSaleTimeFrameId,
          });
        }
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTimeFrames();
  }, []);

  useEffect(() => {
    console.log(flashSaleTimeFrameId);
    setLocalState({
      type: "selectedTimeFrame",
      payload: flashSaleTimeFrameId,
    });
  }, [flashSaleTimeFrameId]);

  useEffect(() => {
    console.log(localState.selectedTimeFrame);
  }, [localState.selectedTimeFrame]);

  useEffect(() => {
    const fetchProductByTimeFrame = async () => {
      try {
        const payload = {
          timeFrameId: localState.selectedTimeFrame,
          page: page,
          limit: 10,
        };
        console.log(payload);
        const res = await getFlashSaleProducts(payload);
        if (res.statusCode === 200) {
          setLocalState({ type: "products", payload: res.data });
          setLocalState({ type: "totalPages", payload: res.totalPages });
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (localState.selectedTimeFrame) {
      fetchProductByTimeFrame();
    }
  }, [localState.selectedTimeFrame, page]);
  useEffect(() => {
    if (localState.times.length > 0 && localState.selectedTimeFrame) {
      const findTimeFrame = localState.times.find(
        (time) => time.flashSaleTimeFrameId === localState.selectedTimeFrame
      );
      const startTime = moment.tz(findTimeFrame?.startedAt, "Asia/Ho_Chi_Minh");
      const endedTime = moment.tz(findTimeFrame?.endedAt, "Asia/Ho_Chi_Minh");

      const currentTime = moment.tz(new Date(), "Asia/Ho_Chi_Minh");

      if (currentTime.isBetween(startTime, endedTime)) {
        setLocalState({
          type: "time",
          payload: {
            endtime: endedTime.format("YYYY-MM-DD HH:mm:ss"),
            status: "active",
          },
        });
      } else if (currentTime.isAfter(endedTime)) {
        setLocalState({
          type: "time",
          payload: {
            endtime: endedTime.format("YYYY-MM-DD HH:mm:ss"),
            status: "ended",
          },
        });
      } else {
        setLocalState({
          type: "time",
          payload: {
            endtime: startTime.format("YYYY-MM-DD HH:mm:ss"),
            status: "waiting",
          },
        });
      }
    }
  }, [localState.selectedTimeFrame, localState.times]);

  return (
    <>
      <div className="max-w-[1400px] mx-auto my-10">
        <div className="w-full bg-white border-[1px] shadow-lg flex justify-center items-center py-5 gap-3 mb-3">
          <img
            className="bg-red-500 p-2 h-[50px]"
            src={flashSaleIconShopee}
            alt=""
          />
          <span className="text-neutral-600">
            <ClockCircleFilled />{" "}
            {localState.time.status === "active"
              ? "Ends In"
              : localState.time.status === "ended"
              ? "Ended"
              : "Starts in"}
          </span>

          <FlipClockCountdown
            to={localState.time.endtime}
            hideOnComplete={true}
            onComplete={() => {
              if (localState.time.status !== "ended") {
                console.log(localState.time.status);
                console.log("Flash sale ended");
                setLocalState({ type: "openModal", payload: true });
              }
            }}
            labels={["HOURS", "MINUTES", "SECONDS"]}
            labelStyle={{
              fontSize: 10,
              fontWeight: 500,
              textTransform: "uppercase",
            }}
            className="flip-clock mt-3"
            digitBlockStyle={{ width: 20, height: 30, fontSize: 30 }}
            dividerStyle={{ color: "black", height: 1 }}
            separatorStyle={{ color: "red", size: "6px" }}
            duration={0.5}
            renderMap={[false, true, true, true]}
          />
        </div>
        <div className="w-full">
          <div className=" h-[400px] bg-black">
            <img
              src={Banner1}
              className="w-full object-contain size-full shadow-lg "
              alt=""
            />
          </div>
          <div className="flex justify-start items-center bg-neutral-600">
            {localState.times.map((time) => {
              const startedAt = moment.tz(time?.startedAt, "Asia/Ho_Chi_Minh");
              const isToday = startedAt.isSame(moment(), "day");
              const isTomorrow = startedAt.isSame(
                moment().add(1, "day"),
                "day"
              );
              const isYesterday = startedAt.isSame(
                moment().subtract(1, "day"),
                "day"
              );
              return (
                <div
                  key={time.flashSaleTimeFrameId}
                  className={`time-frame-item ${
                    time.flashSaleTimeFrameId === localState.selectedTimeFrame
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => {
                    navigate(
                      `/flash-sales?flashSaleTimeFrameId=${time.flashSaleTimeFrameId}&page=1`
                    );
                  }}
                >
                  <div>{startedAt.format("HH:mm")}</div>
                  <div>
                    {isToday
                      ? "Today"
                      : isTomorrow
                      ? "Tomorrow"
                      : isYesterday
                      ? "Yesterday"
                      : startedAt.format("DD/MM/YYYY")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {localState.products.length === 0 && (
          <div className="mt-6 flex justify-center items-center h-[300px]">
            <div className="flex flex-col gap-2 items-center">
              <GrNotes className="text-primary text-[40px]" />
              There are no products in flash sale yet.
            </div>
          </div>
        )}
        {localState.products.length > 0 && (
          <>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {localState.products.map((product, key) => (
                <ProductFlashSaleCard
                  key={key}
                  product={product}
                  status={localState.time.status}
                />
              ))}
            </div>

            <Pagination
              className="mt-5"
              align="center"
              current={page}
              defaultCurrent={page}
              total={localState.totalPages * 10}
              pageSize={10}
              showSizeChanger={false}
              hideOnSinglePage={localState.products.length <= 10 ? true : false}
              onChange={(page, pageSize) =>
                navigate(
                  `/flash-sales?flashSaleTimeFrameId=${flashSaleTimeFrameId}&page=${page}`
                )
              }
            />
          </>
        )}
      </div>
      <Modal
        open={localState.openModal}
        centered={true}
        closable={false}
        footer={
          <div className="w-full flex justify-center items-center">
            <Button
              size="large"
              onClick={() => {
                setLocalState({ type: "openModal", payload: false });
                window.location.href = "/flash-sales";
              }}
            >
              {localState.time.status === "active" ? "Close" : "Shop Now"}
            </Button>
          </div>
        }
      >
        <div className="text-2xl text-center w-full font-semibold">
          {localState.time.status === "active"
            ? " Flash Sale Has Ended. Thank you for participating!"
            : "Flash Sale Has Begun. Shop Now!!!"}
        </div>
      </Modal>
    </>
  );
};

export default FlashSalePage;
