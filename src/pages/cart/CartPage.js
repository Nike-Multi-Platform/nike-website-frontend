import React, { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "../../components/cart/CartItem";
import { fetchBag } from "../../redux/cartSlice";
import { Button, Result } from "antd";
import RecommendationCarousel from "../../components/products/RecommendationCarousel";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [localState, setLocalState] = useReducer((state, action) => {
    return { ...state, [action.type]: action.payload };
  }, {});
  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchBag(user?.userId));
    }
  }, [dispatch, user?.userId]);
  console.log("cart", cart);
  return (
    <>
      {user?.userId && (
        <>
          <div className="max-w-[1100px] mx-auto grid grid-cols-12 my-10 gap-8">
            <div className="col-span-7">
              <div className="text-3xl font-semibold mb-8">Bag</div>
              <div className="w-full flex flex-col gap-4 border-b-[1px]">
                {cart?.cart?.length === 0 && (
                  <div className="text-xl">Your cart is empty</div>
                )}
                {cart?.cart?.length > 0 &&
                  cart?.cart?.map((item, index) => (
                    <CartItem key={index} item={item} />
                  ))}
              </div>
            </div>
            <div className="col-span-5">
              <div className="flex flex-col mb-4">
                <div className="text-3xl font-semibold ">Summary</div>
                <span className="text-neutral-500">
                  Final price will be confirmed upon order
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between py-2 border-b-[1px]">
                  <div className="font-semibold">Total cost</div>
                  <div className="flex justify-center items-center font-semibold">
                    <sup>đ</sup>{" "}
                    {cart?.totalPrice?.toLocaleString("vi-VN") || 0}
                  </div>
                </div>
                <div className="flex justify-between py-2 border-b-[1px]">
                  <div className="font-semibold">Discount</div>
                  <div className="flex justify-center items-center font-semibold text-red-700">
                    -<sup>đ</sup>{" "}
                    {cart?.discountPrice?.toLocaleString("vi-VN") || 0}
                  </div>
                </div>
                <div className="flex flex-col mt-2 gap-3">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">Save</div>
                    <div className="flex justify-center items-center font-semibold text-yellow-600">
                      <sup>đ</sup>{" "}
                      {cart?.discountPrice?.toLocaleString("vi-VN") || 0}
                    </div>
                  </div>
                  <div className="flex justify-between items-center ">
                    <div className="font-semibold flex flex-col ">
                      Estimated price
                      <span className="text-sm">
                        ({cart?.totalQuantity || 0} products)
                      </span>
                    </div>
                    <div className="flex justify-center items-center font-semibold text-primary text-2xl">
                      <sup>đ</sup>{" "}
                      {cart?.totalPrice?.toLocaleString("vi-VN") || 0}
                    </div>
                  </div>
                </div>
              </div>
              <Button className="w-full rounded-full mt-6 bg-red-500 border-red-500 text-white text-lg hover:opacity-80">
                {" "}
                Checkout
              </Button>
            </div>
          </div>
          <div className="max-w-[1400px] mx-auto my-14">
            <RecommendationCarousel />
          </div>
        </>
      )}
      {!user?.userId && (
        <div className="max-w-[1400px] mx-auto flex justify-center items-center flex-col">
          <Result status={"error"} title="You are not logged in." />
          <Button
            size="large"
            className="bg-red-500 text-white border-red-500 hover:opacity-80"
            onClick={() => navigate("/login")}
          >
            Login Now
          </Button>
        </div>
      )}
    </>
  );
};

export default CartPage;
