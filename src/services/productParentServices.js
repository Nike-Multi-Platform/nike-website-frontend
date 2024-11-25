import axios from "axios";

const url = `${process.env.REACT_APP_BACKEND_URL}/api/Product`;

export const getNewRelease = async (page, limit) => {
  try {
    const response = await axios.get(
      `${url}/new-release?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getProductsByObjectId = async (objectId, page, limit) => {
  try {
    const response = await axios.get(
      `${url}/products-by-object-id?objectId=${objectId}&page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getDetailProduct = async (productParentId) => {
  try {
    const response = await axios.get(
      `${url}/product-parent-detail/${productParentId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getColorDetail = async (productId) => {
  try {
    const response = await axios.get(`${url}/product-detail/${productId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
