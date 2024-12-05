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
