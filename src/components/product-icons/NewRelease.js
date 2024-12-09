import React, { memo, useEffect, useReducer } from "react";
import { getNewRelease } from "../../services/productParentServices";
import ProductCard from "../products/ProductCard";
import { useNavigate } from "react-router-dom";

const NewRelease = () => {
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      newReleases: [],
    }
  );
  const navigate = useNavigate();
  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        const res = await getNewRelease(1, 8);
        setLocalState({
          type: "newReleases",
          payload: res.data,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchNewReleases();
  }, []);
  return (
    <>
      {localState.newReleases.length > 0 && (
        <div className="flex flex-col gap-4 mt-5">
          <div className="w-full justify-between items-center flex">
            <span className="font-nike  uppercase text-2xl font-semibold">
              Just In
            </span>
            <span
              className="text-neutral-500 font-semibold cursor-pointer"
              onClick={() =>
                navigate(
                  "/categories?SortBy=createAt&productObjectId=1&productObjectId=2&productObjectId=3"
                )
              }
            >
              See All
            </span>
          </div>
          <div className="grid grid-cols-12 gap-4">
            {localState.newReleases.map((release, key) => (
              <ProductCard product={release} key={key} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default memo(NewRelease);
