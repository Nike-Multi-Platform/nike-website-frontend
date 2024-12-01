import axios from "axios";

const url = `${process.env.REACT_APP_BACKEND_URL}/api/Bag`;

export const addToBag = async (userId, productSizeId, quantity) => {
  try {
    const res = await axios.post(`${url}/add-to-bag`, null, {
      params: {
        user_id: userId,
        product_size_id: productSizeId,
        amount: quantity,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const removeFromBag = async (bagId) => {
  try {
    const res = await axios.post(`${url}/remove-item`, null, {
      params: {
        bagId,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateQuantity = async (bag_id, type) => {
  try {
    const res = await axios.post(`${url}/update-quantity`, null, {
      params: {
        bag_id,
        type,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateSelectedBagItem = async (bag_id, isSelected) => {
  try {
    const res = await axios.post(`${url}/update-select`, null, {
      params: {
        bag_id,
        isSelected,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateSize = async (bag_id, product_size_id) => {
  try {
    const res = await axios.post(`${url}/update-size`, null, {
      params: {
        bag_id,
        product_size_id,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getBag = async (userId) => {
  try {
    const res = await axios.get(`${url}/get-bag/${userId}`);
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getSizes = async (productId) => {
  try {
    const res = await axios.get(`${url}/get-sizes/${productId}`);
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};
