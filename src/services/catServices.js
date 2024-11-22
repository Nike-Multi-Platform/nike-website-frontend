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
