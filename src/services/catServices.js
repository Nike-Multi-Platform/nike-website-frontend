import axios from "axios";

const url = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const getCategories = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: `${url}/Product/product-objects`,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getIcons = async (page, limit) => {
  try {
    const response = await axios.get(
      `${url}/Product/product-icons?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
