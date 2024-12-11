import React, { useEffect, useReducer, useState } from 'react'
import { motion } from "framer-motion";
import { Button, Divider, Input, message } from 'antd';
import { FcGoogle } from 'react-icons/fc';
import bgAbstract from "../../../src/assets/Designer.png";
import { IoMdEye } from 'react-icons/io';
import { RiEyeCloseLine } from 'react-icons/ri';
import { LoginGoogle, LoginWithEmailPassword } from '../../services/userService';
import { em } from 'framer-motion/client';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../../firebase/AuthenticationFirebase';
import { getAuth, unlink } from 'firebase/auth';
import toast from 'react-hot-toast';
import ModalForgotPassword from '../../components/user/ModalForgotPassword';
message.config({
    top: 150
});

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
            loading: false,
        }
    );


    const navigate = useNavigate();

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

    const handleLoginEmailPassword = async () => {
        const errors = {};

        if (!loginState.data?.identifier || loginState.data.identifier.trim() === "") {
            errors.identifier = "Please enter your email or username";
        }

        if (!loginState.data?.password || loginState.data.password.trim() === "") {
            errors.password = "Please enter your password";
        }

        if (Object.keys(errors).length > 0) {
            setLoginState({ type: "error", payload: errors });
            return;
        }

        setLoginState({ type: "loading", payload: true });

        try {
            const payload = {
                email: loginState.data?.identifier,
                password: loginState.data?.password,
            };
            const response = await LoginWithEmailPassword(payload);

            if (response?.statusCode === 200) {
                message.success(response?.message);
                console.log("Login success", response.data);
                localStorage.setItem("token", response?.data);
                navigate("/");
            } else {
                const errorMessage = response?.message;
                message.error(errorMessage);
                console.log("Error when login", errorMessage);
            }
        } catch (error) {
            message.error("Error when login");
            console.log("Error when login", error);
        } finally {
            setLoginState({ type: "loading", payload: false });
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const resUser = await signInWithGoogle();
            const auth = getAuth();
            const currentUser = auth.currentUser;

            for (let provider of resUser.providerData) {
                if (provider.email !== resUser.email) {
                    try {
                        await unlink(currentUser, provider.providerId);
                        console.log(`Unlinked provider: ${provider.providerId}`);
                    } catch (error) {
                        console.error("Error unlinking provider: ", error);
                    }
                }
            }

            const idToken = await currentUser.getIdToken();

            const payload = { idToken };

            try {
                const resLoginGoogle = await LoginGoogle(payload);
                if (resLoginGoogle?.statusCode === 200) {
                    localStorage.setItem("token", resLoginGoogle?.data);
                    message.success("Đăng nhập thành công");
                    console.log("Login success", resLoginGoogle);
                    navigate("/");
                } else {
                    const errorMessage = resLoginGoogle?.message;
                    message.error(errorMessage);
                    console.log("Error when login", errorMessage);
                }
            } catch (error) {
                message.error("Error when login");
                console.log("Error when login", error);
            }
        } catch (error) {
            console.log("Error:", error);
            message.error(error?.message || "Login failed");
        }
    };


    useEffect(() => {
        const errors = {};
        // Validate identifier
        if (loginState.data?.identifier === "") {
            errors.identifier = "Please enter your email or username";
        }

        // Validate password
        if (loginState.data?.password === "") {
            errors.password = "Please enter your password";
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
                            >
                                <h1 className="font-[500] text-primary text-2xl text-center mb-7">
                                    Sign in
                                </h1>
                                <div className="flex flex-col h-[74px]">
                                    <Input
                                        tabIndex={1}
                                        className="border py-2 px-3 w-full"
                                        name="identifier"
                                        status={loginState.error?.identifier ? "error" : ""}
                                        placeholder="Email / Username"
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
                                            placeholder="password"
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
                                    onClick={() => handleLoginEmailPassword()}
                                    tabIndex={3}
                                    loading={loginState.loading}
                                >
                                    SIGN IN
                                </Button>
                            </form>
                            <div
                                className="flex justify-end mt-4 text-sm text-[#05a]"
                                tabIndex={4}
                            >
                                <span
                                    className="cursor-pointer"
                                  onClick={() => setLoginState({ type: "isVisbleResetModal", payload: true })}
                                >
                                    Forgot password?
                                </span>
                            </div>
                            <Divider>
                                <span className="text-slate-400 text-xs">OR</span>
                            </Divider>
                            <div className="flex justify-center">
                                <button
                                    className="border rounded p-2 w-[165px]"
                                    onClick={() => handleGoogleSignIn()}
                                >
                                    <span className="flex gap-1 justify-center items-center">
                                        <FcGoogle size={23} /> Google
                                    </span>
                                </button>
                            </div>
                            <div className="flex justify-center items-center gap-1 mt-8 mb-4 text-sm">
                                <span className="text-slate-400 ">You do not have an account?</span>
                                <a href="/register" className="text-primary" tabIndex={5}>
                                    Sign up
                                </a>
                            </div>
                        </div>
                    </section>
                </motion.div>
                <ModalForgotPassword isVisbleResetModal={loginState.isVisbleResetModal} onClosed={() => setLoginState({ type: "isVisbleResetModal", payload: false })} />
            </div>
        </div>
    )
}

export default Login