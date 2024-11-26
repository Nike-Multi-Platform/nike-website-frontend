import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: "",
  userUsername: "",
  userGender: "",
  userEmail: "",
  userPhoneNumber: "",
  userAddress: "",
  userFirstName: "",
  userLastName: "",
  userUrl: "",
  roleId: "",
  bags: [],
  goodsReceipts: [],
  historySearches: [],
  productReviews: [],
  role: null,
  userDiscountVouchers: [],
  userFavoriteProducts: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload.userId;
      state.userUsername = action.payload.userUsername;
      state.userGender = action.payload.userGender;
      state.userEmail = action.payload.userEmail;
      state.userPhoneNumber = action.payload.userPhoneNumber;
      state.userAddress = action.payload.userAddress;
      state.userFirstName = action.payload.userFirstName;
      state.userLastName = action.payload.userLastName;
      state.userUrl = action.payload.userUrl;
      state.roleId = action.payload.roleId;
      state.bags = action.payload.bags;
      state.goodsReceipts = action.payload.goodsReceipts;
      state.historySearches = action.payload.historySearches;
      state.productReviews = action.payload.productReviews;
      state.role = action.payload.role;
      state.userDiscountVouchers = action.payload.userDiscountVouchers;
      state.userFavoriteProducts = action.payload.userFavorite
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.userId = "";
      state.userUsername = "";
      state.userGender = "";
      state.userEmail = "";
      state.userPhoneNumber = "";
      state.userAddress = "";
      state.userFirstName = "";
      state.userLastName = "";
      state.userUrl = "";
      state.roleId = "";
      state.bags = [];
      state.goodsReceipts = [];
      state.historySearches = [];
      state.productReviews = [];
      state.role = null;
      state.userDiscountVouchers = [];
      state.userFavoriteProducts = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, logout, setToken } = userSlice.actions;

export default userSlice.reducer;
