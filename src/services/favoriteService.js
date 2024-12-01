import axios from "axios";

const url = `${process.env.REACT_APP_BACKEND_URL}/api/Favorite`;

export const addToFavorites = async (userId, productId) => {
  try {
    const res = await axios.post(`${url}/add-to-favorites`, null, {
      params: {
        userId: userId,
        product_id: productId,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const removeFromFavorites = async (id) => {
  try {
    const res = await axios.post(`${url}/remove-from-favorites`, null, {
      params: {
        id,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getFavorites = async (userId, page, limit) => {
  try {
    const res = await axios.get(
      `${url}/get-favorites/${userId}?page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};
