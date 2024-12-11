import axios from "axios";

const url = `${process.env.REACT_APP_BACKEND_URL}/api/FlashSale`;

export const getCurrentFlashSale = async (limit) => {
  try {
    const response = await axios.get(
      `${url}/get-current-flash-sales?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getAvailableTimeFrames = async () => {
  try {
    const response = await axios.get(`${url}/get-available-time-frames`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getFlashSaleProducts = async (payload) => {
  try {
    const response = await axios.get(
      `${url}/get-products-by-time-frame-id?timeFrameId=${payload.timeFrameId}&page=${payload.page}&limit=${payload.limit}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
