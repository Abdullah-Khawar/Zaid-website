import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

const backendUrl = import.meta.env.BACKEND_URL; 


// Async action to fetch user data dynamically
export const fetchUserData = createAsyncThunk("user/fetchUserData", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${backendUrl}/profile`, {
      credentials: "include", // Ensures cookies (token) are sent
    });

    
    if (!response.ok) {
      if (response.status === 401) {
        return rejectWithValue({ message: "Unauthorized", status: 401 });
      }
      throw new Error("Failed to fetch user data");
    }

    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async action to fetch customer orders
export const fetchCustomerOrders = createAsyncThunk("user/fetchCustomerOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${backendUrl}/orders`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch customer orders");
    }

    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchCartItems = createAsyncThunk(
  "user/fetchCartItems",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = state.user.loggedInUser;

      if (!user || !user._id) {
        throw new Error("User is not logged in or missing user ID");
      }

      const response = await fetch(`${backendUrl}/cart?userId=${user._id}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }

      const data = await response.json();
      console.log("Fetched Cart Data:", data); // ✅ Debugging Step

      return Array.isArray(data.cartItems) ? data.cartItems : [];
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  loggedInUser: null, // Store user info
  customerOrders: [], // Store orders of the customer
  cartItems: [], // Store cart items of the user
  userStatus: 'idle', // Loading status for user
  totalQuantity: 0,
  ordersStatus: 'idle', // Loading status for orders
  cartStatus: 'idle', // Loading status for cart
  currentStep: 1, // Track the current step in the checkout process
  error: null, // Store any fetch errors
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.loggedInUser = action.payload;
    },
    setCustomerOrders: (state, action) => {
      state.customerOrders = action.payload;
    },
    setCartItems: (state, action) => {
      state.cartItems = Array.isArray(action.payload.cartItems) ? action.payload.cartItems : [];
      
      // Calculate total quantity when setting cart items
      state.totalQuantity = state.cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
    },

    updateTotalQuantity: (state, action) => {
      state.totalQuantity = action.payload;
    },
    updateQuantity: (state, action) => {
      const { productId, size, color, quantity } = action.payload;
      const cartItem = state.cartItems.find(
        (item) =>
          item.productId === productId &&
          item.variations.some((v) => v.size === size && v.color === color)
      );

      if (cartItem) {
        cartItem.variations.forEach((variation) => {
          if (variation.size === size && variation.color === color) {
            variation.quantity = quantity;
          }
        });
      }
    },
    rollbackQuantity: (state, action) => {
      const { productId, size, color, prevQuantity } = action.payload;
      const cartItem = state.cartItems.find(
        (item) =>
          item.productId === productId &&
          item.variations.some((v) => v.size === size && v.color === color)
      );

      if (cartItem) {
        cartItem.variations.forEach((variation) => {
          if (variation.size === size && variation.color === color) {
            variation.quantity = prevQuantity;
          }
        });
      }
    },
    clearUser: (state) => {
      state.loggedInUser = null;
      state.customerOrders = [];
      state.cartItems = [];
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    resetCurrentStep: (state) => {
      state.currentStep = 1;
    },
    logout: (state) => {
      state.loggedInUser = null;
      state.customerOrders = [];
      state.cartItems = [];
      state.currentStep = 1; // Reset step to default on logout
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user data
      .addCase(fetchUserData.pending, (state) => {
        state.userStatus = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userStatus = 'succeeded';
        state.loggedInUser = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.userStatus = 'failed';
        state.error = action.payload?.message || action.error.message;

        if (action.payload?.status === 401) {
          state.loggedInUser = null; // Log out user if unauthorized
        }
      })

      // Fetch customer orders
      .addCase(fetchCustomerOrders.pending, (state) => {
        state.ordersStatus = 'loading';
      })
      .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
        state.ordersStatus = 'succeeded';
        state.customerOrders = action.payload;
      })
      .addCase(fetchCustomerOrders.rejected, (state, action) => {
        state.ordersStatus = 'failed';
        state.error = action.error.message;
      })

      // Fetch cart items
      .addCase(fetchCartItems.pending, (state) => {
        state.cartStatus = 'loading';
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.cartStatus = 'succeeded';
        state.cartItems = Array.isArray(action.payload) ? action.payload : [];
      
        // Calculate total quantity
        state.totalQuantity = state.cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
      
        console.log("Cart Items Updated in Redux:", state.cartItems);
        console.log("Updated Total Quantity:", state.totalQuantity); // ✅ Debugging
      
        localStorage.setItem("cart", JSON.stringify(state.cartItems)); // Sync localStorage
      })
      
      
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.cartStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

// Selectors for efficient state access
export const selectUser = (state) => state.user.loggedInUser;
export const selectCustomerOrders = (state) => state.user.customerOrders;
export const selectCartItems = (state) => Array.isArray(state.user.cartItems) ? state.user.cartItems : [];
export const selectCartStatus = (state) => state.user.cartStatus;
export const selectOrdersStatus = (state) => state.user.ordersStatus;
export const selectUserStatus = (state) => state.user.userStatus;

// Selector to calculate total cart price
export const selectCartTotal = createSelector(
  [selectCartItems],
  (cartItems) => cartItems.reduce((total, item) => total + (item.price * item.quantity || 0), 0)
);

export const {
  setUser,
  setCustomerOrders,
  setCartItems,
  updateTotalQuantity,
  clearUser,
  setCurrentStep,
  resetCurrentStep,
  rollbackQuantity,
  updateQuantity,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
