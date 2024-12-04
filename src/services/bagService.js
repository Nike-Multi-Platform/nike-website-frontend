import axios from "axios";
import { u } from "framer-motion/client";

const url = `${process.env.REACT_APP_BACKEND_URL}/api/Bag`;

export const addToBag = async (userId, productSizeId, quantity) => {
  try {
    console.log(`Requesting: ${url}/add-to-bag/${userId}`);
    console.log("Params:", {
      product_size_id: productSizeId,
      amount: quantity,
    });

    const res = await axios.post(`${url}/add-to-bag/${userId}`, null, {
      params: {
        product_size_id: productSizeId,
        amount: quantity,
      },
    });

    console.log("API Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const removeFromBag = async (bagId) => {
  try {
    const res = await axios.post(`${url}/remove-item/${bagId}`, null);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const updateQuantity = async (bag_id, quantity) => {
  try {
    const res = await axios.post(`${url}/update-quantity/${bag_id}`, null, {
      params: {
        quantity,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const updateSelectedBagItem = async (bag_id, isSelected) => {
  try {
    const res = await axios.post(`${url}/update-select/${bag_id}`, null, {
      params: {
        isSelected,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const updateSize = async (bag_id, userId, product_size_id) => {
  try {
    const res = await axios.post(`${url}/update-size/${bag_id}`, null, {
      params: {
        userId,
        product_size_id,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getBag = async (userId) => {
  try {
    const res = await axios.get(`${url}/get-bag/${userId}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getSizes = async (productId) => {
  try {
    const res = await axios.get(`${url}/get-sizes/${productId}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getTotalItems = async (userId) => {
  try {
    const res = await axios.get(`${url}/get-total-items/${userId}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const applyVoucher = async (userId, voucherCode) => {
  try {
    const res = await axios.get(
      `${url}/apply-voucher?userId=${userId}&promoCode=${voucherCode}`
    );
    return res.data;
  } catch (error) {
    
    throw new Error(error.response?.data?.message || error.message);
  }
};
