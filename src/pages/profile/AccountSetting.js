import React, { useEffect, useReducer } from "react";
import { Form, Input, Button, Upload, Spin, Select, message } from "antd";
import SettingSidebar from "../../components/profile/SettingSidebar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkNumberPhone } from "../../helpers/formatPhoneNumber";
import { updateProfile, verifyUser } from "../../services/userService";
import { logout, setUser } from "../../redux/userSlice";

const { Option } = Select;
message.config({
  top: 150,
});

const AccountSetting = () => {
  const [form] = Form.useForm();
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const fetchUserData = async (token) => {
    try {
      if (!token) {
        throw new Error("Token is missing.");
      }
      const payload = {
        idToken: token,
      };
      const response = await verifyUser(payload);
      if (response?.statusCode === 200) {
        console.log("Fetch user data success", response?.data?.user);
        dispatch(setUser(response?.data?.user));
      } else {
        const errorMessage = response?.message || "Unknown error";
        console.log("Error fetching user data", errorMessage);
        dispatch(logout());
      }
    } catch (error) {
      console.log("Error when fetching user data", error);
    }
  };
  const [localState, setLocalState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      userLoaded: false,
      user_info: null,
      imageUrl: [],
      disable: true,
      error: {
        imageUrl: "",
        userUsername: "",
        userPhoneNumber: "",
        userAddress: "",
        userFirstName: "",
        userLastName: "",
      },
      loading: false,
    }
  );

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const validate = (name, value) => {
    const errors = { ...localState.error };
    const userInfo = { ...localState.user_info, [name]: value };
    // Validate username
    if (!userInfo.userUsername?.trim()) {
      errors.userUsername = "Please input your username!";
    } else {
      errors.userUsername = "";
    }
    // Validate phone number
    if (!userInfo.userPhoneNumber?.trim()) {
      errors.userPhoneNumber = "Please input your phone number!";
    } else {
      const phoneError = checkNumberPhone(userInfo.userPhoneNumber);
      errors.userPhoneNumber = phoneError ? phoneError : "";
    }
    // Validate address
    if (!userInfo.userAddress?.trim()) {
      errors.userAddress = "Please input your address!";
    } else {
      errors.userAddress = "";
    }
    // Validate first name
    if (!userInfo.userFirstName?.trim()) {
      errors.userFirstName = "Please input your first name!";
    } else {
      errors.userFirstName = "";
    }
    // Validate last name
    if (!userInfo.userLastName?.trim()) {
      errors.userLastName = "Please input your last name!";
    } else {
      errors.userLastName = "";
    }

    setLocalState({ error: errors, user_info: userInfo });

    // Check if any error exists
    return Object.values(errors).some((err) => err !== "");
  };

  const handleUpdateProfile = async () => {
    const { user_info, imageUrl } = localState;
    const payload = {
      UserId: user_info.userId,
      UserName: user_info.userUsername,
      UserPhoneNumber: user_info.userPhoneNumber,
      userAddress: user_info.userAddress,
      UserFirstName: user_info.userFirstName,
      UserLastName: user_info.userLastName,
      UserGender: user_info.userGender,
      ImageUrl: imageUrl[0] || "",
    };
    console.log("Payload:", payload);
    setLocalState({ loading: true });
    const response = await updateProfile(payload);
    if (response?.statusCode === 200) {
      message.success("Profile updated successfully!");
      // update user info in redux
      await fetchUserData(token);
    } else {
      message.error(response.message);
    }
    setLocalState({ loading: false });
  };

  const handleOnChange = (name, value) => {
    const hasErrors = validate(name, value);
    setLocalState({
      disable: hasErrors,
    });
  };

  useEffect(() => {
    if (!user || !user.userId) {
      setLocalState({ userLoaded: false });
      const timer = setTimeout(() => {
        message.error("User not found. Redirecting to home page...");
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    }

    setLocalState({
      userLoaded: true,
      user_info: user,
      imageUrl: user.userUrl !== "" ? [user.userUrl] : [],
    });

    form.setFieldsValue({
      username: user.userUsername,
      phone: user.userPhoneNumber,
      address: user.userAddress,
      firstName: user.userFirstName,
      lastName: user.userLastName,
      gender: user.userGender,
    });
  }, [user, form, navigate]);

  if (!localState.userLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-row max-w-[1400px] mx-auto">
      <div className="w-1/4">
        <SettingSidebar index="account-details" />
      </div>
      <div className="w-3/4 ml-10 mt-10">
        <div>
          <h1 className="text-2xl font-nike">Account Details</h1>
          <Form
            form={form}
            layout="vertical"
            className="mt-4 w-2/4"
            loading={localState.loading}
          >
            <Form.Item
              name="username"
              label="Username"
              help={localState.error.userUsername}
              validateStatus={localState.error.userUsername ? "error" : ""}
            >
              <Input
                disabled={true}
                onChange={(e) => handleOnChange("userUsername", e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone Number"
              help={localState.error.userPhoneNumber}
              validateStatus={localState.error.userPhoneNumber ? "error" : ""}
            >
              <Input
                onChange={(e) =>
                  handleOnChange("userPhoneNumber", e.target.value)
                }
              />
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
              help={localState.error.userAddress}
              validateStatus={localState.error.userAddress ? "error" : ""}
            >
              <Input
                onChange={(e) => handleOnChange("userAddress", e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="firstName"
              label="First Name"
              help={localState.error.userFirstName}
              validateStatus={localState.error.userFirstName ? "error" : ""}
            >
              <Input
                onChange={(e) =>
                  handleOnChange("userFirstName", e.target.value)
                }
              />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              help={localState.error.userLastName}
              validateStatus={localState.error.userLastName ? "error" : ""}
            >
              <Input
                onChange={(e) => handleOnChange("userLastName", e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[
                { required: true, message: "Please select your gender!" },
              ]}
            >
              <Select placeholder="Select Gender">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                className={`bg-black text-white font-nikeBody ${localState.disable ? " bg-gray-500" : ""
                  }`}
                disabled={localState.disable}
                loading={localState.loading}
                onClick={handleUpdateProfile}
              >
                Save
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AccountSetting;
