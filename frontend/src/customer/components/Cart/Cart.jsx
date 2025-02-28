import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCartItems,
  removeFromCart,
  updateQuantity, // Import updateQuantity from cartSlice
} from "../../../reduxStore/features/cartSlice";
import { Link } from "react-router-dom";
import {
  setCurrentStep,
  rollbackQuantity,
  fetchCartItems,
} from "../../../reduxStore/features/userSlice";
import { toast } from "react-toastify";

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.user.currentStep);
  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const cartItems = useSelector((state) => state.cart.cartItems || []); // Default to empty array
  const customerOrders = useSelector((state) => state.user.customerOrders);
  const backendUrl = import.meta.env.BACKEND_URL
  
  
  // Function to move to the next step
  const handleNextStep = async () => {
    try {
      const updatedCart = cartItems.map((item) => ({
        productId: item.productId._id || item.productId,
        variations: item.variations.map((variation) => ({
          size: variation.size,
          color: variation.color,
          quantity: variation.quantity,
        })),
      }));
  
      const requestBody = {
        cartItems: updatedCart,
        userId: loggedInUser?._id,
        sessionId: document.cookie
              .split("; ")
              .find((row) => row.startsWith("sessionId="))
              ?.split("=")[1],
      };
  
      console.log("Updating Cart Payload:", requestBody);
  
      const response = await fetch(`${backendUrl}/cart/update`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update cart");
      }
  
      toast.success("Cart updated successfully");
      dispatch(setCurrentStep(currentStep + 1)); // Proceed to next step
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    }
  };
  
  const updateCartQuantityToBackend = async ()=>{
    try {
      const updatedCart = cartItems.map((item) => ({
        productId: item.productId._id || item.productId,
        variations: item.variations.map((variation) => ({
          size: variation.size,
          color: variation.color,
          quantity: variation.quantity,
        })),
      }));
  
      const requestBody = {
        cartItems: updatedCart,
        userId: loggedInUser?._id,
        sessionId: document.cookie
              .split("; ")
              .find((row) => row.startsWith("sessionId="))
              ?.split("=")[1],
      };
  
      console.log("Updating Cart Payload in continue shopping:", requestBody);
  
      const response = await fetch(`${backendUrl}/cart/update`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update cart");
      }
  
      toast.success("Cart updated successfully in continue shop");
     
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    }
  }

  const updateItemQuantity = (productId, size, color, quantity) => {
    if (quantity < 1) return; // Prevent negative values
  
    const updatedProductId = productId._id || productId;
  
    // Update Redux state directly
    dispatch(updateQuantity({ productId: updatedProductId, size, color, quantity }));
  };
  

  const removeItem = async (productId, size, color) => {
    try {
      const requestBody = { 
        productId: productId._id,  // Ensure only _id is sent
        size, 
        color 
      };
  
      if (loggedInUser?._id) {
        requestBody.userId = loggedInUser._id;
      } else {
        requestBody.sessionId = document.cookie
          .split("; ")
          .find((row) => row.startsWith("sessionId="))
          ?.split("=")[1];
      }
  
      console.log("Removing Item - Payload:", requestBody);
  
      // **Optimistic UI update (ensure it removes variation correctly)**
      dispatch(removeFromCart({ productId: productId._id, size, color }));
  
      const response = await fetch(`${backendUrl}/cart/remove`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      if(response.ok){
        toast.success('Item removed Successfully');
      }
  
      console.log("Item removed successfully!");
  
      // **Ensure state is re-fetched after successful removal**
      dispatch(fetchCartItems());  // Fetch latest cart from backend
  
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };
  

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return (
        total +
        item.variations.reduce(
          (variationTotal, variation) =>
            variationTotal + variation.quantity * item.price,
          0
        )
      );
    }, 0);
  };

  useEffect(() => {
    // Only reset to step 1 when the Cart page is loaded
    if (currentStep !== 1) {
      dispatch(setCurrentStep(1)); // Set to Cart step if not already set
    }
  }, [dispatch, currentStep]);

  // Handle the browser's back/forward button navigation
  useEffect(() => {
    const handlePopState = () => {
      // If we're navigating forward or back, update the step based on the current page
      if (window.location.pathname.includes("cart") && currentStep !== 1) {
        dispatch(setCurrentStep(1)); // Ensure we're at the Cart step
      } else if (
        window.location.pathname.includes("checkout") &&
        currentStep !== 2
      ) {
        dispatch(setCurrentStep(2)); // Ensure we're at the Checkout step
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentStep, dispatch]);

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <ol className="items-center mb-6 flex w-full max-w-2xl text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
          {/* Cart Step */}
          <li
            className={`after:border-1 flex items-center ${
              currentStep >= 1 ? "text-green-700 bg-green-100" : "text-gray-500"
            } after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-['/'] md:w-full xl:after:mx-10`}
          >
            <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
              <svg
                className="me-2 h-4 w-4 sm:h-5 sm:w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Cart
            </span>
          </li>

          {/* Checkout Step */}
          <li
            className={`after:border-1 flex items-center ${
              currentStep >= 2 ? "text-green-700 bg-green-100" : "text-gray-500"
            } after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-['/'] md:w-full xl:after:mx-10`}
          >
            <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
              <svg
                className="me-2 h-4 w-4 sm:h-5 sm:w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Checkout
            </span>
          </li>

          {/* Order Summary Step */}
          <li
            className={`flex shrink-0 items-center ${
              currentStep >= 3 ? "text-green-700 bg-green-100" : "text-gray-500"
            }`}
          >
            <svg
              className="me-2 h-4 w-4 sm:h-5 sm:w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Order summary
          </li>
        </ol>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          Shopping Cart
        </h2>
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          {/* Cart Items Section */}
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl flex flex-col gap-4">
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item) =>
                item.variations.map((variation) => (
                  <div
                    key={variation._id}
                    className="space-y-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6"
                  >
                    <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                      <Link
                        to={`/products/${item.productId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 md:order-1"
                      >
                        <img
                          className="h-20 w-20"
                          src={variation.image}
                          alt={`${item.name} - ${variation.color} - ${variation.size}`}
                        />
                      </Link>

                      <div className="flex items-center justify-between md:order-3 md:justify-end">
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() =>
                              updateItemQuantity(
                                item.productId,
                                variation.size,
                                variation.color,
                                variation.quantity - 1
                              )
                            }
                            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                          >
                            <svg
                              className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 18 2"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h16"
                              />
                            </svg>
                          </button>
                          <input
                            type="text"
                            className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                            value={variation.quantity}
                            readOnly
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateItemQuantity(
                                item.productId,
                                variation.size,
                                variation.color,
                                variation.quantity + 1
                              )
                            }
                            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                          >
                            <svg
                              className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 18 18"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 1v16M1 9h16"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="text-end md:order-4 md:w-32">
                          <p className="text-base font-bold text-gray-900 dark:text-white">
                            ${item.price * variation.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                        <Link
                          to={`/products/${item.productId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base font-medium text-gray-900 hover:underline dark:text-white"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-4">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Color: {variation.color}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Size: {variation.size}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(
                                item.productId,
                                variation.size,
                                variation.color
                              )
                            }
                            className="inline-flex cursor-pointer items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>

          {/* Order Summary Section */}
          <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                Order Summary
              </p>
              <div className="space-y-4">
                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt className="text-base font-bold text-gray-900 dark:text-white">
                    Total
                  </dt>
                  <dd className="text-base font-bold text-gray-900 dark:text-white">
                    ${calculateTotal().toFixed(2)}
                  </dd>
                </dl>
              </div>
              {/* Taxes and Shipping Information */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Taxes and shipping calculated at checkout.
              </p>
              {/* Proceed to Checkout Button */}
              <Link
                onClick={handleNextStep}
                to="/checkout"
                className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 transition-all duration-300 ease-in-out relative group mt-4"
              >
                Proceed to Checkout
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-all duration-300 ease-in-out"></span>
              </Link>

              <div className="flex justify-center items-center my-4 text-sm text-gray-500 dark:text-gray-400">
                <span>OR</span>
              </div>

              {/* Continue Shopping Button */}
              <Link
                onClick={updateCartQuantityToBackend}
                to="/"
                className="flex w-full items-center justify-center rounded-lg bg-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShoppingCart;
