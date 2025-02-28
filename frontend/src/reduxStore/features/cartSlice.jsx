import { createSlice } from "@reduxjs/toolkit";

// Ensure localStorage retrieval is safe and always returns an array
const getCartFromLocalStorage = () => {
  try {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    return Array.isArray(storedCart) ? storedCart : [];
  } catch (error) {
    console.error("Error parsing cart data from localStorage:", error);
    return [];
  }
};


const initialState = {
  cartItems: getCartFromLocalStorage(), // Load from localStorage for guests
  isGuest: !localStorage.getItem("token"), // Check if user is a guest
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find(i => i.productId === item.productId);

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.cartItems.push({ ...item, quantity: item.quantity || 1 });
      }

      localStorage.setItem("cart", JSON.stringify(state.cartItems)); // Save to local storage
    },

    setCartItems: (state, action) => {
      state.cartItems = Array.isArray(action.payload) ? action.payload : [];
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cart");
    },
    removeFromCart: (state, action) => {
      const { productId, size, color } = action.payload;
      state.cartItems = state.cartItems
        .map((item) => {
          if (item.productId._id === productId) {
            // Remove the specific variation
            const updatedVariations = item.variations.filter(
              (variation) => variation.size !== size || variation.color !== color
            );

            // If no variations remain, remove the product entirely
            return updatedVariations.length ? { ...item, variations: updatedVariations } : null;
          }
          return item;
        })
        .filter(Boolean); // Remove null entries (empty products)
    },

    updateQuantity: (state, action) => {
      const { productId, size, color, quantity } = action.payload;
      state.cartItems = state.cartItems.map((item) => {
        if (item.productId._id === productId) {
          return {
            ...item,
            variations: item.variations.map((variation) =>
              variation.size === size && variation.color === color
                ? { ...variation, quantity }
                : variation
            ),
          };
        }
        return item;
      });
    }
  }
});

// ✅ Export actions and reducer
export const { addToCart, removeFromCart, setCartItems, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
