import { Carousel } from "antd";
import React, { memo, useEffect, useReducer } from "react";
import { getIcons } from "../../services/catServices";
import { getImageByCloudinary } from "../../helpers/getImageByCloudinary";

const IconsContainer = () => {
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      icons: [],
    }
  );

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const res = await getIcons(1, 10);
        setLocalState({
          type: "icons",
          payload: res.data,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchIcons();
  }, []);

  return (
    <div className="flex flex-col gap-4 mt-5">
      <span className="font-nike  uppercase text-2xl font-semibold">
        Shop By Icons
      </span>
      <Carousel
        arrows
        rows={1}
        slidesToShow={4}
        className={`container-carousel ${
          localState.icons?.length < 4 ? "not-enough-slide" : ""
        }`}
        infinite={false}
        dots={false}
        centerMode={false}
        focusOnSelect={true}
      >
        {localState.icons.map((icon) => (
          <div key={icon.productIconsId} className="h-[400px] cursor-pointer">
            <img
              src={getImageByCloudinary(icon.thumbnail)}
              alt=""
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default memo(IconsContainer);
