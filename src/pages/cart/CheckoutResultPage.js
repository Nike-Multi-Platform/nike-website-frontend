import { Button, Result, Steps } from "antd";
import React, { useEffect, useReducer } from "react";
import { LuShoppingBag } from "react-icons/lu";
import { MdOutlinePayment } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { getPaymentStatus } from "../../services/paymentService";

const CheckoutResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "loading":
          return { ...state, loading: action.payload };
        case "error":
          return { ...state, error: action.payload };
        case "success":
          return { ...state, success: action.payload };
        default:
          return state;
      }
    },
    {
      loading: false,
      error: {
        isError: false,
        message: "",
      },
      success: {
        isSuccess: false,
        message: "",
      },
      warning: {
        isWarning: false,
        message: "",
      },
    }
  );

  const getQueryParams = (search) => {
    return new URLSearchParams(search);
  };

  const queryParams = getQueryParams(location.search);

  const vnp_Amount = queryParams.get("vnp_Amount");
  const vnp_BankCode = queryParams.get("vnp_BankCode");
  const vnp_BankTranNo = queryParams.get("vnp_BankTranNo");
  const vnp_CardType = queryParams.get("vnp_CardType");
  const vnp_OrderInfo = queryParams.get("vnp_OrderInfo");
  const vnp_PayDate = queryParams.get("vnp_PayDate");
  const vnp_ResponseCode = queryParams.get("vnp_ResponseCode");
  const vnp_TmnCode = queryParams.get("vnp_TmnCode");
  const vnp_TransactionNo = queryParams.get("vnp_TransactionNo");
  const vnp_TransactionStatus = queryParams.get("vnp_TransactionStatus");
  const vnp_TxnRef = queryParams.get("vnp_TxnRef");
  const vnp_SecureHash = queryParams.get("vnp_SecureHash");
  const status = queryParams.get("status");
  const method = queryParams.get("method");
  const { error, success, warning, loading } = localState;

  useEffect(() => {
    const updateOrder = async () => {
      try {
        setLocalState({ type: "loading", payload: true });
        const params = new URLSearchParams({
          vnp_Amount,
          vnp_BankCode,
          vnp_BankTranNo,
          vnp_CardType,
          vnp_OrderInfo,
          vnp_PayDate,
          vnp_ResponseCode,
          vnp_TmnCode,
          vnp_TransactionNo,
          vnp_TransactionStatus,
          vnp_TxnRef,
          vnp_SecureHash,
        });

        const res = await getPaymentStatus(params.toString());
        console.log(res);
        if (res.data === "fail") {
          setLocalState({
            type: "error",
            payload: { isError: true, message: res.message },
          });
        } else if (res.data === "success") {
          setLocalState({
            type: "success",
            payload: { isSuccess: true, message: res.message },
          });
        } else {
          setLocalState({
            type: "warning",
            payload: { isWarning: true, message: res.message },
          });
        }
        setLocalState({ type: "loading", payload: false });
      } catch (error) {
        console.log(error);
        setLocalState({
          type: "error",
          payload: { isError: true, message: error.message },
        });
      }
    };
    if (method === "VNPAY") {
      updateOrder();
    }
  }, [method]);

  useEffect(() => {
    if (status !== "" && method === "COD") {
      setLocalState({
        type: "success",
        payload: {
          isSuccess: status === "success",
          message:
            status === "success"
              ? "Thank you for supporting Hamans Vietnam. Your order will be shipped to you soon."
              : "Payment failed",
        },
      });
    }
  }, [status, method]);
  return (
    <section className="max-w-[1400px] mx-auto py-5">
      <div className="grid grid-cols-12 gap-7">
        <div className="col-span-12">
          <Result
            status={
              loading
                ? "info"
                : success.isSuccess
                ? "success"
                : error.isError
                ? "error"
                : "warning"
            }
            title={
              <span className="font-semibold text-3xl">
                {loading
                  ? "Processing"
                  : success.isSuccess
                  ? "Payment successful"
                  : error.isError
                  ? "Payment failed"
                  : "An error occurred."}
              </span>
            }
            subTitle={
              <span className="text-lg text-neutral-600">
                {loading
                  ? "Please wait a moment"
                  : success.isSuccess
                  ? success.message
                  : error.isError
                  ? error.message
                  : warning.isWarning
                  ? warning.message
                  : "An error occurred."}
              </span>
            }
            extra={
              <Button
                className="bg-red-500 border-red-500 text-white hover:opacity-80"
                size="large"
                onClick={() => navigate("/")}
              >
                Go to Home
              </Button>
            }
          />
        </div>
      </div>
    </section>
  );
};

export default CheckoutResultPage;
