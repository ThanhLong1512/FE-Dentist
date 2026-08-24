import { createSlice } from "@reduxjs/toolkit";

function readCartStats() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!Array.isArray(cart)) return { countCart: 0, totalPrice: 0 };
    const countCart = cart.length;
    const totalPrice = cart.reduce((sum, item) => {
      const price = item.priceDiscount ?? item.priceService ?? 0;
      return sum + price * (item.quantity || 1);
    }, 0);
    return { countCart, totalPrice };
  } catch {
    return { countCart: 0, totalPrice: 0 };
  }
}

const initial = readCartStats();

const cartUiSlice = createSlice({
  name: "cartUi",
  initialState: {
    countCart: initial.countCart,
    totalPrice: initial.totalPrice,
  },
  reducers: {
    setCountCart(state, action) {
      state.countCart = Number(action.payload) || 0;
    },
    setTotalPrice(state, action) {
      state.totalPrice = Number(action.payload) || 0;
    },
    syncCartUiFromItems(state, action) {
      const cart = Array.isArray(action.payload) ? action.payload : [];
      state.countCart = cart.length;
      state.totalPrice = cart.reduce((sum, item) => {
        const price = item.priceDiscount ?? item.priceService ?? 0;
        return sum + price * (item.quantity || 1);
      }, 0);
    },
    clearCartUi(state) {
      state.countCart = 0;
      state.totalPrice = 0;
    },
  },
});

export const {
  setCountCart,
  setTotalPrice,
  syncCartUiFromItems,
  clearCartUi,
} = cartUiSlice.actions;
export default cartUiSlice.reducer;
