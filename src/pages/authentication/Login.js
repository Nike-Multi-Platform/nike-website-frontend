import React, { useEffect, useReducer } from 'react'
import { motion } from "framer-motion";
import { Button, Divider, Input } from 'antd';
import { FcGoogle } from 'react-icons/fc';
import bgAbstract from "../../../src/assets/engaged.png";
import { IoMdEye } from 'react-icons/io';
import { RiEyeCloseLine } from 'react-icons/ri';

const Login = () => {
    const [loginState, setLoginState] = useReducer(
        (state, action) => {
            return { ...state, [action.type]: action.payload };
        },
        {
            data: null,
            hidePassword: false,
            error: {
                identifier: "",
                password: "",
            },
            isVisbleResetModal: false,
        }
    );

    const passwordInputType = loginState.hidePassword ? "text" : "password";

    const handleHidePassword = (e) => {
        e.preventDefault();
        setLoginState({
            type: "hidePassword",
            payload: !loginState.hidePassword,
        });
    };

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setLoginState({
            type: "data",
            payload: {
                ...loginState.data,
                [name]: value,
            },
        });

    };

    useEffect(() => {
        const errors = {};

        // Validate identifier
        if (loginState.data?.identifier === "") {
            errors.identifier = "Vui lòng nhập email hoặc tên đăng nhập";
        }

        // Validate password
        if (loginState.data?.password === "") {
            errors.password = "Vui lòng nhập mật khẩu";
        }

        setLoginState({ type: "error", payload: errors });

    }, [loginState.data]);


    return (
        <div className="w-full bg-cover bg-background-Shop-2 relative flex items-center justify-center">
            <div className="w-full h-full backdrop-blur-md">
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="flex justify-center mt-14"
                >
                    <section className="w-fit flex justify-center  items-center border-solid shadow-2xl">
                        <div className="hidden h-full lg:block">
                            <img
                                className="object-cover w-[500px] h-full rounded-s"
                                src={bgAbstract}
                            />
                        </div>
                        <div className="w-[400px] h-full bg-white rounded px-7 py-10 ">
                            <form className=" flex flex-col"
                            //   onSubmit={handleOnSubmit}
                            >
                                <h1 className="font-[500] text-primary text-2xl text-center mb-7">
                                    Đăng nhập
                                </h1>
                                <div className="flex flex-col h-[74px]">
                                    <Input
                                        tabIndex={1}
                                        className="border py-2 px-3 w-full"
                                        name="identifier"
                                        status={loginState.error?.identifier ? "error" : ""}
                                        placeholder="Email/Tên đăng nhập"
                                        onChange={handleOnChange}
                                        type="text"
                                    />
                                    <span className="text-red-700 text-sm">
                                        {loginState.error?.identifier}
                                    </span>
                                </div>

                                <div className="relative flex">
                                    <div className="w-full h-[74px]">
                                        <Input
                                            tabIndex={2}
                                            className="border py-2 px-3 w-full"
                                            name="password"
                                            status={loginState.error?.password ? "error" : ""}
                                            placeholder="Mật khẩu"
                                            type={passwordInputType}
                                            onChange={handleOnChange}
                                        />
                                        <span className="text-red-700 text-sm">
                                            {loginState.error?.password}
                                        </span>
                                    </div>

                                    <div
                                        onClick={handleHidePassword}
                                    >
                                        {loginState.hidePassword ? (
                                            <IoMdEye
                                                size={20}
                                                className="absolute right-3 top-2 text-slate-500"
                                            />
                                        ) : (
                                            <RiEyeCloseLine
                                                size={20}
                                                className="absolute right-3 top-2 text-slate-500"
                                            />
                                        )}
                                    </div>
                                </div>

                                <Button
                                    className="hover:opacity-90 rounded py-2"
                                    htmlType="submit"
                                    tabIndex={3}
                                >
                                    ĐĂNG NHẬP
                                </Button>
                            </form>
                            <div
                                className="flex justify-end mt-4 text-sm text-[#05a]"
                                tabIndex={4}
                            >
                                <span
                                    className="cursor-pointer"
                                //   onClick={() => setIsVisbleResetModal(true)}
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
                                //   onClick={handleGoogleSignIn}
                                >
                                    <span className="flex gap-1 justify-center items-center">
                                        <FcGoogle size={23} /> Google
                                    </span>
                                </button>
                            </div>
                            <div className="flex justify-center items-center gap-1 mt-8 mb-4 text-sm">
                                <span className="text-slate-400 ">Bạn mới biết đến Hamans?</span>
                                <a href="/register" className="text-primary" tabIndex={5}>
                                    Đăng ký
                                </a>
                            </div>
                        </div>
                    </section>
                </motion.div>
            </div>
        </div>
    )
}

export default Login