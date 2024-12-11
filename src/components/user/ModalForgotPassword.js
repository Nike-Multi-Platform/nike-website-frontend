import { Alert, Button, Input, Modal } from "antd";
import React, { useEffect, useReducer } from "react";
import { checkEmailFormat } from "../../helpers/formatEmail";
import { resetPassword } from "../../services/userService";
import { use } from "framer-motion/client";

const ModalForgotPassword = (props) => {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "emailReset":
          return { ...state, emailReset: action.value };
        case "error":
          return { ...state, error: action.value };
        case "warning":
          return { ...state, warning: action.value };
        case "loading":
          return { ...state, loading: action.value };
        default:
          return state;
      }
    },
    {
      emailReset: "",
      error: null,
      warning: null,
      loading: false,
    }
  );

  const { emailReset, error, warning, loading } = state;
  const { isVisbleResetModal = false, onClosed } = props;

  const handleEmailResetChange = (e) => {
    const emailReset = e.target.value;
    dispatch({ type: "emailReset", value: emailReset });
    if (!emailReset) {
      dispatch({ type: "error", value: "Email is required" });
    } else if (!checkEmailFormat(emailReset)) {
      dispatch({ type: "error", value: "Please enter a valid email" });
    } else {
      dispatch({ type: "error", value: null });
    }
  };

  const onSubmitReset = async () => {
    if (!emailReset) {
      dispatch({ type: "error", value: "Please enter a valid email" });
      return;
    }
    else if (!checkEmailFormat(emailReset)) {
      dispatch({ type: "error", value: "Please enter a valid email" });
    }
    dispatch({ type: "loading", value: true });
    const res = await resetPassword(emailReset);
    if (res?.statusCode === 200) {
      dispatch({ type: "error", value: null });
      dispatch({ type: "warning", value: "Please check your email to reset password" });
    }
    else {
      dispatch({ type: "error", value: res?.message || "An unexpected error occurred" });
    }
    dispatch({ type: "loading", value: false });
  };

  const onCancelModal = () => {
    onClosed();
    dispatch({ type: "emailReset", value: "" });
    dispatch({ type: "error", value: null });
    dispatch({ type: "warning", value: null });
  };


  return (
    <Modal
      open={isVisbleResetModal}
      footer={null}
      onCancel={onCancelModal}
      centered
      className="rounded-lg p-6"
    >
      <h3 className="flex justify-center text-[24px] font-semibold text-gray-800 mb-4">
        Forgot Password
      </h3>
      <div className="flex flex-col gap-4 px-6">
        <div className="relative">
          <Input
            placeholder="Enter your email"
            className="w-full rounded-lg p-3 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
            value={emailReset}
            onChange={handleEmailResetChange}
          />
          {error && (
            <div className="mt-2">
              <span className="text-red-600 text-sm">{error}</span>
            </div>
          )}
          {warning && (
            <div className="mt-2">
              <span className="text-green-600 text-sm">{warning}</span>
            </div>
          )}
        </div>
        <Button
          onClick={onSubmitReset}
          className="w-full h-9 bg-black text-white font-semibold hover:bg-blue-700 rounded-lg"
          loading={loading}
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
};

export default ModalForgotPassword;
