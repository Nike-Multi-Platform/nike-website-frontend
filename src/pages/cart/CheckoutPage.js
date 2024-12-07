import { Button, Input, notification, Radio, Result, Select } from "antd";
import React, { useEffect, useMemo, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartCheckoutItem from "../../components/cart/CartCheckoutItem";
import { fetchBag } from "../../redux/cartSlice";
import {
  getDistricts,
  getProvinces,
  getServiceTypes,
  getShippingFee,
  getWards,
} from "../../services/ghnService";
import { debounce } from "lodash";
import { checkNumberPhone } from "../../helpers/formatPhoneNumber";
import { applyVoucher } from "../../services/bagService";
import toast from "react-hot-toast";
import {
  checkoutByCOD,
  createPaymentVNPayUrl,
} from "../../services/paymentService";
const vnpay = require("../../assets/vnpay.png");
const cod = require("../../assets/cod.png");
const PaymentMethodArray = [
  {
    value: "COD",
    name: "Cash on delivery",
    image: cod,
  },
  {
    value: "VNPAY",
    name: "VNPAY",
    image: vnpay,
  },
];
const CheckoutPage = () => {
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      loading: false,
      isDoneText: false,
      shippingFee: 0,
      listProvince: [],
      listDistrict: [],
      listWard: [],
      serviceList: [],
      error: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address: "",
        province: "",
        district: "",
        ward: "",
      },
      selected: {
        province: null,
        district: null,
        ward: null,
      },
      data: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address: "",
        province: "",
        district: "",
        ward: "",
      },
      voucher: null,
      voucherDiscount: 0,
      voucherText: "",
      selectedPaymentMethod: "VNPAY",
    }
  );
  const { listProvince, listDistrict, listWard, error, data, selected } =
    localState;
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchBag(user?.userId));
    }
  }, [dispatch, user?.userId]);
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await getProvinces();
        if (res.code === 200)
          setLocalState({ type: "listProvince", payload: res.data });
      } catch (error) {
        console.log(error);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await getDistricts(selected?.province?.ProvinceID);
        if (res.code === 200) {
          setLocalState({ type: "listDistrict", payload: res.data });
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (selected?.province !== null) {
      fetchDistricts();
    }
  }, [selected?.province]);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const res = await getWards(selected?.district?.DistrictID);
        if (res.code === 200) {
          setLocalState({ type: "listWard", payload: res.data });
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (selected?.district !== null) {
      fetchWards();
    }
  }, [selected?.district]);

  const handleSelectProvince = (value) => {
    const selectedProvince = listProvince.find(
      (province) => province.ProvinceID === value
    );
    console.log(selectedProvince);
    setLocalState({
      type: "listDistrict",
      payload: [],
    });
    setLocalState({
      type: "listWard",
      payload: [],
    });
    setLocalState({
      type: "data",
      payload: {
        ...data,
        address: "",
      },
    });
    setLocalState({
      type: "selected",
      payload: {
        province: selectedProvince,
        district: null,
        ward: null,
      },
    });
  };

  const handleSelectDistrict = (value) => {
    const selectedDistrict = listDistrict.find(
      (district) => district.DistrictID === value
    );
    setLocalState({
      type: "data",
      payload: {
        ...data,
        address: "",
      },
    });
    setLocalState({
      type: "selected",
      payload: {
        ...selected,
        district: selectedDistrict,
        ward: null,
      },
    });
  };

  const handleSelectWard = (value) => {
    const selectedWard = listWard.find((ward) => ward.WardCode === value);
    setLocalState({
      type: "data",
      payload: {
        ...data,
        address: "",
      },
    });
    setLocalState({
      type: "selected",
      payload: {
        ...selected,
        ward: selectedWard,
      },
    });
  };
  const handleOnTextChange = (e) => {
    setLocalState({
      type: "data",
      payload: {
        ...localState.data,
        [e.target.name]: e.target.value,
      },
    });
  };
  const handleOnPromoCodeChange = (e) => {
    setLocalState({
      type: "voucherText",
      payload: e.target.value,
    });
  };
  const debounceFetch = debounce(async (fetchFunction) => {
    await fetchFunction();
  }, 500);
  useEffect(() => {
    const fetchDefaultService = async () => {
      const serviceData = {
        shop_id: 195538,
        from_district: 3695,
        to_district: selected.district.DistrictID,
      };
      try {
        const transportService = await getServiceTypes(serviceData);
        if (transportService.code === 200) {
          const sumWeight = cart?.cart?.reduce((sum, cartItem) => {
            return cartItem?.is_selected === true
              ? sum + cartItem?.details?.weight * cartItem?.amount
              : sum;
          }, 0);
          if (sumWeight >= 20000) {
            transportService.data = transportService.data.filter(
              (service) => service.service_id === 100039
            );
          } else {
            transportService.data = transportService.data.filter(
              (service) => service.service_id !== 100039
            );
          }
          // console.log("transportService: ", transportService);
          const fees = await Promise.all(
            transportService.data.map(async (service) => {
              const feeData = {
                payment_type_id: 2,
                note: "ĐƠN HÀNG TEST",
                required_note: "KHONGCHOXEMHANG",
                return_phone: "0939638911",
                return_address: "100",
                return_district_id: 3695,
                return_ward_code: "90749",
                client_order_code: "",
                to_name: data?.first_name + " " + data?.last_name,
                to_phone: data?.phone_number,
                to_address: data?.address,
                to_ward_code: selected?.ward?.WardCode,
                to_district_id: selected?.district?.DistrictID,
                cod_amount: 0,
                content: "ABCDEF",
                weight: sumWeight,
                length: 0,
                width: 0,
                insurance_value: 0,
                service_id: service?.service_id,
                service_type_id: service?.service_type_id,
                pick_station_id: 0,
                pick_shift: [2],
                items: cart?.cart?.map((cartItem) => ({
                  name: cartItem?.details?.productName,
                  code: cartItem?.details?.productId + "",
                  quantity: cartItem?.amount,
                  price: cartItem?.details?.finalPrice,
                  length: 0,
                  width: 0,
                  height: 0,
                })),
              };
              const fee = await getShippingFee(195538, feeData);
              return {
                ...service,
                fee: fee.data,
              };
            })
          );
          const totalFees = fees.sort(
            (a, b) => b.fee.total_fee - a.fee.total_fee
          );
          console.log("totalFees: ", totalFees);
          setLocalState({ type: "serviceList", payload: totalFees });
        }
      } catch (error) {
        console.log("Lỗi khi lấy dịch vụ mặc định: ", error.message || error);
      }
    };
    const fetchData = async () => {
      if (
        selected?.district?.DistrictID !== null &&
        selected?.ward?.WardCode &&
        cart?.cart?.length > 0 &&
        data?.first_name !== "" &&
        data?.last_name !== "" &&
        data?.email !== "" &&
        data?.phone_number !== "" &&
        data?.address !== "" &&
        error?.first_name === "" &&
        error?.last_name === "" &&
        error?.email === "" &&
        error?.phone_number === "" &&
        error?.address === "" &&
        error?.province === "" &&
        error?.district === "" &&
        error?.ward === ""
      ) {
        console.log("fetchData");
        console.log(data);
        await debounceFetch(fetchDefaultService);
      }
    };
    fetchData();
  }, [
    selected?.district?.DistrictID,
    localState.isDoneText,
    selected?.ward?.WardCode,
    cart?.cart,
    data,
    error,
  ]);
  useEffect(() => {
    if (localState.serviceList.length > 0) {
      const defaultService = localState.serviceList[0];
      setLocalState({
        type: "shippingFee",
        payload: defaultService.fee.total_fee,
      });
    }
  }, [localState.serviceList]);
  const validate = () => {
    let localErrors = {
      first_name: "",
      last_name: "",
      phone_number: "",
      address: "",
      province: "",
      district: "",
      ward: "",
    };
    if (data.first_name?.length === 0) {
      localErrors = {
        ...localErrors,
        first_name: "First name cannot be blank",
      };
    } else if (data.first_name?.length > 30) {
      localErrors = {
        ...localErrors,
        first_name: "First name must not exceed 30 characters",
      };
    }
    if (data.last_name?.length === 0) {
      localErrors = { ...localErrors, last_name: "First name cannot be blank" };
    } else if (data.last_name?.length > 30) {
      localErrors = {
        ...localErrors,
        last_name: "Last name must not exceed 30 characters",
      };
    }
    if (data.email?.length === 0) {
      localErrors = { ...localErrors, email: "Email cannot be blank" };
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      localErrors = { ...localErrors, email: "Invalid email" };
    }
    const checkPhoneNumber = checkNumberPhone(data.phone_number);
    if (data.phone_number?.length === 0) {
      localErrors = {
        ...localErrors,
        phone_number: "Phone number cannot be empty",
      };
    } else if (
      data.phone_number?.length < 10 ||
      data.phone_number?.length > 10 ||
      checkPhoneNumber !== ""
    ) {
      localErrors = {
        ...localErrors,
        phone_number: checkPhoneNumber,
      };
    }
    if (data.address === "") {
      localErrors = { ...localErrors, address: "Address cannot be empty" };
    } else if (data.address?.trim()?.length > 40) {
      localErrors = {
        ...localErrors,
        address: "Address must not exceed 40 characters",
      };
    }
    if (!selected.province) {
      localErrors = {
        ...localErrors,
        province: "Province/City cannot be empty",
      };
    }
    if (!selected.district) {
      localErrors = { ...localErrors, district: "District cannot be empty" };
    }
    if (!selected.ward) {
      localErrors = { ...localErrors, ward: "Ward/Commune cannot be empty" };
    }

    const hasErrors = Object.values(localErrors).some((error) => error !== "");
    if (hasErrors) {
      setLocalState({ type: "error", payload: localErrors });
      return false;
    }
    return true;
  };

  useEffect(() => {
    const isValid = validate();
    if (isValid) {
      let newError = { ...error };

      if (data.first_name.length > 0 && data.first_name.length <= 30) {
        newError.first_name = "";
      }
      if (data.last_name.length > 0 && data.last_name.length <= 30) {
        newError.last_name = "";
      }
      if (
        data.email.length > 0 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
      ) {
        newError.email = "";
      }
      if (
        data.phone_number.length === 10 &&
        data.phone_number.startsWith("0") &&
        checkNumberPhone(data.phone_number) === ""
      ) {
        newError.phone_number = "";
      }

      if (data.address.trim().length > 0 && data.address.trim().length <= 100) {
        newError.address = "";
      }

      if (selected.province) {
        newError.province = "";
      }

      if (selected.district) {
        newError.district = "";
      }

      if (selected.ward) {
        newError.ward = "";
      }

      setLocalState({ type: "error", payload: newError });
    }
  }, [data, selected]);
  const formatDateTime = (dateString) => {
    if (!dateString) return null;

    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    return new Intl.DateTimeFormat("vi-VN", options).format(
      new Date(dateString)
    );
  };
  const handleApplyVoucher = async () => {
    try {
      const res = await applyVoucher(user?.userId, localState.voucherText);
      console.log(res);
      if (res.statusCode === 404) {
        notification.error({
          message: res?.message,
          showProgress: true,
          pauseOnHover: false,
        });
      }
      if (res.statusCode === 200) {
        // setLocalState({ type: "voucherDiscount", payload: res.data.discount });
        console.log(res.data);

        const discount = calculateDiscount(cart?.totalPrice, res.data);
        if (!discount.isSuccess) {
          notification.error({
            message: discount.message,
            showProgress: true,
            pauseOnHover: false,
          });
        } else {
          notification.success({
            message: res?.message,
            showProgress: true,
            pauseOnHover: false,
          });
        }
        setLocalState({ type: "voucher", payload: res.data.discountVoucherId });
        setLocalState({ type: "voucherDiscount", payload: discount.discount });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: error?.message,
        showProgress: true,
        pauseOnHover: false,
      });
    }
  };
  const onPaymentMethodChange = (e) => {
    setLocalState({ type: "selectedPaymentMethod", payload: e.target.value });
  };
  const selectedCartItem = cart?.cart?.filter((item) => item?.is_selected);
  function calculateDiscount(totalOrderValue, discountVoucher) {
    if (totalOrderValue < discountVoucher.minOrderValue) {
      return {
        isSuccess: false,
        discount: 0,
        message: "Order value does not meet the minimum required for discount.",
      };
    }

    let discount = 0;

    if (discountVoucher.discountType === "BY PERCENT") {
      discount = (totalOrderValue * discountVoucher.discountValue) / 100;
      if (discount > discountVoucher.discountMaxValue) {
        discount = discountVoucher.discountMaxValue;
      }
    } else if (discountVoucher.discountType === "NOT BY PERCENT") {
      discount = discountVoucher.discountValue;
    }

    return {
      isSuccess: true,
      discount,
      finalPrice: totalOrderValue - discount,
    };
  }

  const totalPrice = useMemo(() => {
    return localState?.shippingFee > 0
      ? cart?.totalPrice + localState?.shippingFee - localState?.voucherDiscount
      : 0;
  }, [localState?.shippingFee, cart?.totalPrice, localState?.voucherDiscount]);
  const handleSubmitPlaceOrder = async (type) => {
    const address = `${data.address}, ${selected.ward.WardName}, ${selected.district.DistrictName}, ${selected.province.ProvinceName}`;
    const ghnService = `${selected.province.ProvinceID},${selected.district.DistrictID},${selected.ward.WardCode},${localState.serviceList[0].service_id},${localState.serviceList[0].service_type_id}`;
    const payload = {
      orderType: "other",
      amount: totalPrice,
      orderDescription: "Thanh toán đơn hàng",
      name: data.first_name + " " + data.last_name,
      order:
        selectedCartItem.length > 0
          ? {
              userOrderId: null,
              userId: user.userId,
              userOrderStatusId: 1,
              firstName: data.first_name,
              lastName: data.last_name,
              address: address,
              email: data.email,
              phoneNumber: data.phone_number,
              paymentMethod: type,
              orderCode: null,
              orderCodeReturn: null,
              return_expiration_date: null,
              isReviewed: 0,
              isProcessed: 0,
              voucherApplied:
                localState.voucher !== null ? `${localState.voucher}` : null,
              isCanceledBy: null,
              shippingFee: localState.shippingFee,
              totalQuantity: cart?.totalQuantity,
              totalPrice: cart?.totalPrice,
              discountPrice: localState?.voucherDiscount,
              finalPrice: totalPrice,
              ghnService: ghnService,
              bagItems: selectedCartItem,
            }
          : null,
    };
    if (type === "COD") {
      try {
        const res = await checkoutByCOD(payload);
        if (res.statusCode === 400) {
          toast.error(res.message);
        }
        if (res.statusCode === 200) {
          window.location.href =
            "/cart/checkout/result?method=COD&status=success";
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    } else {
      try {
        const res = await createPaymentVNPayUrl(payload);
        if (res.statusCode === 400) {
          toast.error(res.message);
        }
        if (res.statusCode === 200) {
          window.location.href = res.data;
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };
  return (
    <>
      {user?.userId && (
        <>
          <div className="max-w-[1100px] mx-auto grid grid-cols-12 my-10 gap-8">
            {/**Delivery */}

            <div className="col-span-7">
              <div className="text-3xl font-semibold mb-8">Delivery</div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="text-2xl">Enter your name and address:</span>
                  <span className="text-neutral-500">
                    If you have a promo code, you will be able to input it after
                    filling in your contact details.
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-lg font-semibold text-neutral-600">
                    First Name
                  </span>
                  <Input
                    placeholder="First Name"
                    size="large"
                    name="first_name"
                    value={data.first_name}
                    onChange={handleOnTextChange}
                  />
                  <span className="text-red-500">{error?.first_name}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-lg font-semibold text-neutral-600">
                    Last Name
                  </span>
                  <Input
                    placeholder="Last Name"
                    size="large"
                    name="last_name"
                    value={data.last_name}
                    onChange={handleOnTextChange}
                  />
                  <span className="text-red-500">{error?.last_name}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-lg font-semibold text-neutral-600">
                    Email
                  </span>
                  <Input
                    placeholder="Email"
                    size="large"
                    name="email"
                    value={data.email}
                    onChange={handleOnTextChange}
                  />
                  <span className="text-red-500">{error?.email}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-lg font-semibold text-neutral-600">
                    Phone Number
                  </span>
                  <Input
                    placeholder="Phone Number"
                    size="large"
                    name="phone_number"
                    value={data.phone_number}
                    onChange={handleOnTextChange}
                  />
                  <span className="text-red-500">{error?.phone_number}</span>
                </div>
                <div className="flex gap-3 w-full items-center">
                  <div className="flex flex-col gap-1 w-full">
                    <span className="text-lg font-semibold text-neutral-600">
                      Province/City
                    </span>
                    <Select
                      size="large"
                      placeholder="Select Province/City"
                      onChange={handleSelectProvince}
                      value={
                        selected?.province
                          ? selected.province.ProvinceID
                          : undefined
                      }
                    >
                      {listProvince?.map((province) => (
                        <Select.Option
                          key={province.ProvinceID}
                          value={province.ProvinceID}
                        >
                          {province.ProvinceName}
                        </Select.Option>
                      ))}
                    </Select>
                    <span className="text-red-500">{error?.province}</span>
                  </div>
                </div>
                <div className="flex gap-3 w-full items-center">
                  <div className="flex flex-col gap-1 w-full">
                    <span className="text-lg font-semibold text-neutral-600">
                      District
                    </span>
                    <Select
                      size="large"
                      placeholder="Select District"
                      onChange={handleSelectDistrict}
                      value={
                        selected?.district
                          ? selected.district.DistrictID
                          : undefined
                      }
                    >
                      {listDistrict?.map((district) => (
                        <Select.Option
                          key={district.DistrictID}
                          value={district.DistrictID}
                        >
                          {district.DistrictName}
                        </Select.Option>
                      ))}
                    </Select>
                    <span className="text-red-500">{error?.district}</span>
                  </div>
                </div>
                <div className="flex gap-3 w-full items-center">
                  <div className="flex flex-col gap-1 w-full">
                    <span className="text-lg font-semibold text-neutral-600">
                      Ward/Commune
                    </span>
                    <Select
                      size="large"
                      placeholder="Select Ward/Commune"
                      value={
                        selected?.ward ? selected.ward.WardCode : undefined
                      }
                      onChange={handleSelectWard}
                    >
                      {listWard?.map((ward) => (
                        <Select.Option
                          key={ward.WardCode}
                          value={ward.WardCode}
                        >
                          {ward.WardName}
                        </Select.Option>
                      ))}
                    </Select>
                    <span className="text-red-500">{error?.ward}</span>
                  </div>
                </div>
                <div className="flex gap-3 w-full items-center">
                  <div className="flex flex-col gap-1 w-full">
                    <span className="text-lg font-semibold text-neutral-600">
                      Address
                    </span>
                    <Input
                      size="large"
                      placeholder="Address"
                      name="address"
                      value={data.address}
                      onChange={handleOnTextChange}
                    />
                    <span className="text-red-500">{error?.address}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-16">
                <span className="text-2xl font-semibold">Payment</span>
                <div className="w-full">
                  <Radio.Group
                    className="flex flex-col gap-3"
                    defaultValue={localState.selectedPaymentMethod}
                    onChange={onPaymentMethodChange}
                  >
                    {PaymentMethodArray.map((item) => (
                      <Radio
                        value={item.value}
                        disabled={
                          (item.value === "COD" && totalPrice > 5000000) ||
                          totalPrice === 0
                        }
                      >
                        <div className="w-full flex items-center gap-2">
                          <img src={item.image} alt="" className="w-11" />
                          <div className="flex flex-col">
                            <span>{item.name}</span>
                          </div>
                        </div>
                      </Radio>
                    ))}
                  </Radio.Group>
                </div>
              </div>
              <div className="mt-10 w-full">
                <Button
                  className="w-full rounded-full bg-red-500 border-red-500 text-white hover:opacity-80"
                  size="large"
                  disabled={
                    totalPrice === 0 ||
                    error?.ward !== "" ||
                    error?.district !== "" ||
                    error?.province !== "" ||
                    error?.address !== "" ||
                    error?.phone_number !== "" ||
                    error?.email !== "" ||
                    error?.last_name !== "" ||
                    error?.first_name !== ""
                  }
                  onClick={() =>
                    handleSubmitPlaceOrder(localState.selectedPaymentMethod)
                  }
                >
                  Place Order
                </Button>
              </div>
            </div>
            {/**Order Summary */}
            <div className="col-span-5 flex flex-col gap-2">
              <div className="pb-4 border-b-[1px]">
                <div className="text-3xl font-semibold ">Order Summary</div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between py-2 border-b-[1px]">
                    <div className="font-semibold">Total cost</div>
                    <div className="flex justify-center items-center font-semibold">
                      <sup>đ</sup>{" "}
                      {cart?.totalPriceWithoutDiscount?.toLocaleString(
                        "vi-VN"
                      ) || 0}
                    </div>
                  </div>
                  <div className="flex flex-col py-2 border-b-[1px]">
                    <div className="flex justify-between">
                      <div className="font-semibold">Discount</div>
                      <div className="flex justify-center items-center font-semibold text-red-700">
                        -<sup>đ</sup>{" "}
                        {cart?.discountPrice?.toLocaleString("vi-VN") || 0}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="font-semibold">Voucher Discount</div>
                      <div className="flex justify-center items-center font-semibold text-red-700">
                        -<sup>đ</sup>{" "}
                        {localState?.voucherDiscount?.toLocaleString("vi-VN") ||
                          0}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="font-semibold">Delivery/Shipping</div>
                      <div className="flex justify-center items-center font-semibold text-green-500">
                        <sup>đ</sup>{" "}
                        {localState?.shippingFee?.toLocaleString("vi-VN") || 0}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col mt-2 gap-3">
                    <div className="flex justify-between items-center ">
                      <div className="font-semibold flex flex-col ">
                        Total
                        <span className="text-sm">
                          ({cart?.totalQuantity || 0} products)
                        </span>
                      </div>
                      <div className="flex justify-center items-center font-semibold text-primary text-2xl">
                        <sup>đ</sup> {totalPrice?.toLocaleString("vi-VN") || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1 mb-3 w-full">
                <div className="text-lg text-neutral-500">Promo Code</div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter your code"
                    size="large"
                    className="w-full"
                    value={localState.voucherText}
                    onChange={handleOnPromoCodeChange}
                  />
                  <Button
                    size="large"
                    className="bg-red-500 text-white border-red-500 hover:opacity-80"
                    disabled={localState.voucherText === ""}
                    onClick={handleApplyVoucher}
                  >
                    Apply
                  </Button>
                </div>
              </div>
              <div className="">
                {localState?.serviceList?.length > 0 && (
                  <div className="text-xl text-neutral-500 mb-2">
                    Estimated delivery:{" "}
                    {formatDateTime(
                      localState?.serviceList[0]?.fee?.expected_delivery_time
                    )}
                  </div>
                )}
                {selectedCartItem?.length > 0 &&
                  selectedCartItem?.map((item, key) => (
                    <CartCheckoutItem item={item} key={key} />
                  ))}
              </div>
            </div>
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

export default CheckoutPage;
