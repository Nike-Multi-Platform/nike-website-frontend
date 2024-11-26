import React, { useEffect, useReducer } from "react";
import { motion } from "framer-motion";
import { Button, Divider, Input, message, Select } from "antd";
import { FcGoogle } from "react-icons/fc";
import bgAbstract from "../../../src/assets/Designer.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { checkNumberPhone } from "../../helpers/formatPhoneNumber";
import { RegisterUser } from "../../services/userService";
import { a } from "framer-motion/client";
message.config({
  top: 150
});

const items = [
  {
    value: "Nam",
    label: <span>Nam</span>,
  },
  {
    value: "Nữ",
    label: <span>Nữ</span>,
  },
  {
    value: "Khác",
    label: <span>Khác</span>,
  },
];
const Register = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_LOADING":
          return { ...state, loading: action.payload };
        case "hasStartedTyping":
          return { ...state, hasStartedTyping: true };
        case "SET_isVisbleResetModal":
          return { ...state, isVisbleResetModal: action.payload };
        case "SET_DATA":
          return {
            ...state,
            data: {
              ...state.data,
              [action.payload.name]: action.payload.value,
            },
          };
        case "SET_ERROR":
          return {
            ...state,
            error: {
              ...state.error,
              [action.payload.name]: action.payload.value,
            },
          };

        default:
          return state;
      }
    },
    {
      isVisbleResetModal: false,
      loading: false,
      data: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        password: "",
        retypePassword: "",
      },
      error: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        password: "",
        retypePassword: "",
      },
      hasStartedTyping: false,
    }
  );

  const { loading, data, error, hasStartedTyping, isVisbleResetModal } = state;

  //onTextChanged
  const onTextChanged = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: "hasStartedTyping",
    });
    dispatch({
      type: "SET_DATA",
      payload: { name, value },
    });
  };

  useEffect(() => {
    if (!hasStartedTyping) return;
    //FirstName
    if (data.firstName === "") {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "firstName", value: "Tên không được để trống" },
      });
    } else {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "firstName", value: "" },
      });
    }

    //LastName
    if (data.lastName === "") {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "lastName", value: "Họ không được để trống" },
      });
    } else {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "lastName", value: "" },
      });
    }

    //Email
    if (data.email === "") {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "email", value: "Email không được để trống" },
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "email", value: "Email không hợp lệ" },
      });
    } else {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "email", value: "" },
      });
    }
    const checkPhoneNumber = checkNumberPhone(data.phoneNumber);
    //PhoneNumber
    if (data.phoneNumber === "") {
      dispatch({
        type: "SET_ERROR",
        payload: {
          name: "phoneNumber",
          value: "Số điện thoại không được để trống",
        },
      });
    } else if (data.phoneNumber.length === 10 && checkPhoneNumber !== "") {
      dispatch({
        type: "SET_ERROR",
        payload: {
          name: "phoneNumber",
          value: checkPhoneNumber,
        },
      });
    } else {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "phoneNumber", value: "" },
      });
    }

    //GENDER
    if (data.gender === "") {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "gender", value: "Giới tính không được để trống" },
      });
    } else {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "gender", value: "" },
      });
    }

    //Password
    if (data.password === "") {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "password", value: "Mật khẩu không được để trống" },
      });
    } else if (data.password.length > 0 && data.password.length < 6) {
      dispatch({
        type: "SET_ERROR",
        payload: {
          name: "password",
          value: "Mật khẩu phải có ít nhất 6 ký tự",
        },
      });
    } else {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "password", value: "" },
      });
    }

    //RetypePassword
    if (data.retypePassword === "") {
      dispatch({
        type: "SET_ERROR",
        payload: {
          name: "retypePassword",
          value: "Nhập lại mật khẩu không được để trống",
        },
      });
    } else {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "retypePassword", value: "" },
      });
    }

    // Trường hợp mật khẩu không khớp
    if (data.password !== data.retypePassword) {
      dispatch({
        type: "SET_ERROR",
        payload: { name: "retypePassword", value: "Mật khẩu không khớp" },
      });
    }
  }, [data]);
  document.title = "Đăng Ký";


  const handleOnSubmit = async () => {
    const errors = {};

    // Validate firstName
    if (!data.firstName) {
      errors.firstName = "Tên không được để trống";
    }

    // Validate lastName
    if (!data.lastName) {
      errors.lastName = "Họ không được để trống";
    }

    // Validate email
    if (!data.email) {
      errors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Email không hợp lệ";
    }

    // Validate phoneNumber
    const checkPhoneNumber = checkNumberPhone(data.phoneNumber);
    if (!data.phoneNumber) {
      errors.phoneNumber = "Số điện thoại không được để trống";
    } else if (data.phoneNumber.length !== 10 || checkPhoneNumber !== "") {
      errors.phoneNumber = checkPhoneNumber || "Số điện thoại không hợp lệ";
    }

    // Validate gender
    if (!data.gender) {
      errors.gender = "Giới tính không được để trống";
    }

    // Validate password
    if (!data.password) {
      errors.password = "Mật khẩu không được để trống";
    } else if (data.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Validate retypePassword
    if (!data.retypePassword) {
      errors.retypePassword = "Nhập lại mật khẩu không được để trống";
    } else if (data.password !== data.retypePassword) {
      errors.retypePassword = "Mật khẩu không khớp";
    }

    // Update errors in state
    Object.keys(errors).forEach((key) => {
      dispatch({
        type: "SET_ERROR",
        payload: { name: key, value: errors[key] },
      });
    });

    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
      // message.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Proceed with registration
    dispatch({
      type: "SET_LOADING",
      payload: true,
    });

    const payload = {
      userEmail: data.email,
      password: data.password,
      userGender: data.gender,
      userPhoneNumber: data.phoneNumber,
      userFirstName: data.firstName,
      userLastName: data.lastName,
    };

    try {
      const res = await RegisterUser(payload);
      if (res?.statusCode === 200) {
        message.success(res?.message);
        navigate("/login");
      } else {
        message.error(res?.message || "Đã xảy ra lỗi khi đăng ký");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi đăng ký");
      console.error("Error when registering:", error);
    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
    }
  };


  return (
    <div className="w-full bg-cover bg-background-Shop-2 relative flex items-center justify-center ">
      <div className="w-full h-full backdrop-blur-md ">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex justify-center py-5"
        >
          <section className="w-fit flex justify-center  items-center border-solid shadow-2xl">
            <div className="hidden lg:block h-full">
              <img
                className="w-[700px] h-full object-cover  rounded-s"
                src={bgAbstract}
              />
            </div>
            <div className="w-[450px] h-full bg-white rounded px-7 py-11 ">
              <form
                className=" flex flex-col ">
                <h1 className="font-[500] text-primary text-2xl text-center">
                  Đăng Ký
                </h1>
                <div className=" h-[60.45px]">
                  <Input
                    tabIndex={2}
                    className="border py-2 px-3 w-full"
                    name="firstName"
                    status={error?.firstName ? "error" : ""}
                    placeholder={"Tên"}
                    type="text"
                    onChange={onTextChanged}
                  />
                  <span className="text-sm text-red-700">
                    {error?.firstName ? error?.firstName : ""}
                  </span>
                </div>
                <div className=" h-[60.45px]">
                  <Input
                    tabIndex={3}
                    className="border py-2 px-3 w-full"
                    name="lastName"
                    status={error?.lastName ? "error" : ""}
                    placeholder={"Họ"}
                    type="text"
                    onChange={onTextChanged}
                  />
                  <span className="text-sm text-red-700">
                    {error?.lastName ? error?.lastName : ""}
                  </span>
                </div>
                <div className=" h-[60.45px]">
                  <Input
                    tabIndex={4}
                    className="border py-2 px-3 w-full"
                    name="email"
                    status={error?.email ? "error" : ""}
                    placeholder={error?.email ? error?.email : "Email"}
                    type="email"
                    onChange={onTextChanged}
                  />
                  <span className="text-sm text-red-700">
                    {error?.email ? error?.email : ""}
                  </span>
                </div>
                <div className=" h-[60.45px]">
                  <Input
                    tabIndex={5}
                    className="border py-2 px-3 w-full"
                    name="phoneNumber"
                    status={error?.phoneNumber ? "error" : ""}
                    placeholder={
                      error?.phoneNumber ? error?.phoneNumber : "Số Điện Thoại"
                    }
                    type="tel"
                    onChange={onTextChanged}
                  />
                  <span className="text-sm text-red-700">
                    {error?.phoneNumber ? error?.phoneNumber : ""}
                  </span>
                </div>

                <Select
                  className="w-full"
                  placeholder={error?.gender ? error?.gender : "Giới Tính"}
                  status={error?.gender ? "error" : ""}
                  options={items}
                  tabIndex={6}
                  onChange={(value) => {
                    dispatch({
                      type: "SET_DATA",
                      payload: { name: "gender", value },
                    });
                    dispatch({
                      type: "hasStartedTyping",
                    });
                  }}
                />
                <div className=" h-[60.45px] mt-4">
                  <Input
                    tabIndex={7}
                    className="border py-2 px-3 w-full"
                    name="password"
                    status={error?.password ? "error" : ""}
                    onChange={onTextChanged}
                    placeholder={"Mật khẩu"}
                    type="password"
                  />
                  <span className="text-sm text-red-700">
                    {error?.password ? error?.password : ""}
                  </span>
                </div>
                <div className=" h-[60.45px]">
                  <Input
                    tabIndex={8}
                    className="border py-2 px-3 w-full"
                    name="retypePassword"
                    onChange={onTextChanged}
                    status={error?.retypePassword ? "error" : ""}
                    placeholder={"Nhập lại mật khẩu"}
                    type="password"
                  />
                  <span className="text-sm text-red-700">
                    {error?.retypePassword ? error?.retypePassword : ""}
                  </span>
                </div>

                <Button
                  className="bg-custom-gradient hover:opacity-90 mt-4"
                  onClick={() => handleOnSubmit()}
                  tabIndex={9}
                  loading={loading}
                >
                  ĐĂNG KÝ
                </Button>
              </form>
              <div
                className="flex justify-end mt-4 text-sm text-[#05a]"
                tabIndex={10}
              >
                <span
                  className="cursor-pointer"
                  onClick={() =>
                    dispatch({ type: "SET_isVisbleResetModal", payload: true })
                  }
                >
                  Quên mật khẩu
                </span>
              </div>
              <Divider>
                <span className="text-slate-400 text-xs">HOẶC</span>
              </Divider>
              <div className="flex justify-center">
                <button
                  className="border rounded p-2 w-[165px]"
                // onClick={handleGoogleSignIn}
                >
                  <span className="flex gap-1 justify-center items-center">
                    <FcGoogle size={23} /> Google
                  </span>
                </button>
              </div>
              <div className="flex justify-center items-center gap-1 mt-8 mb-4 text-sm">
                <span className="text-slate-400 ">Đã có tài khoản?</span>
                <a href="/login" className="text-primary" tabIndex={11}>
                  Đăng nhập
                </a>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;