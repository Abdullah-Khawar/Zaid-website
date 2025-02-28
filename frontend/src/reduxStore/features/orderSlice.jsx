import { createSlice } from "@reduxjs/toolkit";

// Initial state for customer orders
const initialState = {
  customerOrders: [],
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // Set the order history data
    setCustomerOrders: (state, action) => {
      state.customerOrders = action.payload;
    },

    // Add a new order to the order history
    addOrder: (state, action) => {
      state.customerOrders.push(action.payload);
    },

    // Update the status of an existing order
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.customerOrders.find((order) => order.orderId === orderId);
      if (order) {
        order.orderStatus = status;
      }
    },

    // Remove an order from the order history
    removeOrder: (state, action) => {
      state.customerOrders = state.customerOrders.filter(
        (order) => order.orderId !== action.payload.orderId
      );
    },
  },
});

// Export actions for dispatch
export const { setCustomerOrders, addOrder, updateOrderStatus, removeOrder } = orderSlice.actions;

// Export the reducer to be used in the store
export default orderSlice.reducer;
