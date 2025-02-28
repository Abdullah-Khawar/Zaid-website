import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice'; // User slice
import cartReducer from './features/cartSlice'; // Cart slice
import orderReducer from './features/orderSlice'; // Order slice

const store = configureStore({
  reducer: {
    user: userReducer,   // State accessed by state.user
    cart: cartReducer,   // State accessed by state.cart
    orders: orderReducer, // State accessed by state.orders
  },
});

export default store;
