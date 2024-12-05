import React, { useEffect, useReducer } from "react";
import { getProductsByObjectId } from "../../services/productParentServices";
import ProductCard from "../products/ProductCard";
import { useNavigate } from "react-router-dom";

const ProductsByObject = (props) => {
  const { objectId } = props;
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      products: [],
    }
  );
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProductsByObject = async () => {
      try {
        const res = await getProductsByObjectId(objectId, 1, 8);
        setLocalState({
          type: "products",
          payload: res.data,
        });
      } catch (error) {
        console.error(error);
      }
    };
    if (objectId) {
      fetchProductsByObject();
    }
  }, [objectId]);
  return (
    <>
      {localState.products.length > 0 && (
        <div className="flex flex-col gap-4 mt-5">
          <div className="w-full justify-between items-center flex">
            <span className="font-nike  uppercase text-2xl font-semibold">
              {objectId === 1 ? "Men" : objectId === 2 ? "Women" : "Kids"}
            </span>
            <span
              className="text-neutral-500 font-semibold cursor-pointer"
              onClick={() =>
                navigate(`/categories?productObjectId=${objectId}`)
              }
            >
              See All
            </span>
          </div>
          <div className="grid grid-cols-12 gap-4">
            {localState.products.map((product, key) => (
              <ProductCard product={product} key={key} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsByObject;
