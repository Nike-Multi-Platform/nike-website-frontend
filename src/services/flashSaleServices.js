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
