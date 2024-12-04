import axios from "axios";

const url = `${process.env.REACT_APP_BACKEND_URL}/api/Payment`;

export const createPaymentVNPayUrl = async (payload) => {
  try {
    console.log(payload);
    const res = await axios.post(`${url}/create-vnpay-url`, payload, {
      headers: {
        "Content-Type": "application/json", // Header để thông báo dữ liệu là JSON
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const checkoutByCOD = async (payload) => {
  try {
    const res = await axios.post(`${url}/checkout-by-cod`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getPaymentStatus = async (payload) => {
  try {
    const res = await axios.get(`${url}/vnpay-return-result?${payload}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
