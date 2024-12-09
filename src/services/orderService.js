import axios from "axios";

const url = `${process.env.REACT_APP_BACKEND_URL}/api/UserOrder`;

export const getStatuses = async () => {
  try {
    const response = await axios.get(`${url}/order-status`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export const getOrders = async (payload) => {
  try {
    const response = await axios.get(
      `${url}/get-orders?userId=${payload.userId}&userOrderStatusId=${payload.status}&text=${payload.keyword}&page=${payload.page}&limit=${payload.limit}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export const getDetails = async (payload) => {
  try {
    const response = await axios.get(
      `${url}/get-details?userOrderId=${payload}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const writeReview = async (payload) => {
  try {
    const response = await axios.post(`${url}/write-review`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const sendRequest = async (payload) => {
  try {
    const response = await axios.post(`${url}/send-request`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
