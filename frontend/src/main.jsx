import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./reduxStore/store";
import {
  setCustomerOrders,
  fetchUserData,
} from "./reduxStore/features/userSlice";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute component


// Pages for vercel
import HomePage from "./customer/components/pages/Home/HomePage";
import ProductDisplayPage from "./customer/components/pages/Home/ProductDisplayPage";
import Layout from "./customer/components/Layout";
import ProductOverview from "./customer/components/Product_Thing/ProductOverview";
import Cart from "./customer/components/Cart/Cart";
import Checkout from "./customer/components/Checkout/Checkout";
import Signup from "./customer/components/Authentication/Signup";
import Login from "./customer/components/Authentication/Login";
import ForgotPassword from "./customer/components/Authentication/ForgotPassword";
import ConfirmCode from "./customer/components/Authentication/ConfirmCode";
import ResetPassword from "./customer/components/Authentication/ResetPassword";
import About from "./customer/components/pages/Home/AboutUs";
import OrderHistoryPage from "./customer/components/Authentication/ProfilePage/OrderHistoryPage";
import Contact from "./customer/components/pages/Home/Contact";
import UserProfile from "./customer/components/Authentication/ProfilePage/UserProfile";
import SearchPage from "./customer/components/Navigation/Search/SearchPage";
import AdminPanel from "./admin/components/AdminPanel";

// Admin Pages
import OverviewPage from "./admin/components/pages/OverviewPage";
import ProductsPage from "./admin/components/pages/ProductsPage";
import UsersPage from "./admin/components/pages/UsersPage";
import SalesPage from "./admin/components/pages/SalesPage";
import OrdersPage from "./admin/components/pages/OrdersPage";
import SettingsPage from "./admin/components/pages/SettingsPage";
import AddProduct from "./admin/components/pages/AddProduct";
import ErrorBoundary from "./customer/components/Product_Thing/ErrorBoundary";
import ShippingPriceControl from "./admin/components/pages/ShippingPriceControl";
import OrderSummary from "./customer/components/Checkout/OrderSummary";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.loggedInUser);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserData());
    }
    setLoading(false);
  }, [dispatch, user]);

  useEffect(() => {
    console.log("Current User:", user);
  }, [user]);

  if (loading) {
    return <div className="loading">Loading...</div>; // Show loading state while fetching user data
  }

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="forgotPassword" element={<ForgotPassword />} />
          <Route path="confirmCode" element={<ConfirmCode />} />
          <Route path="resetPassword" element={<ResetPassword />} />
          <Route path="aboutus" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="products" element={<ProductDisplayPage />} />
          <Route path="products/:_id" element={<ProductOverview />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="order-summary" element={<OrderSummary />} />
        </Route>

        {/* 🔒 Protected Routes - Require Login */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orderHistory"
          element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userProfile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

{user && user.role === "admin" && (
  <Route path="admin" element={<AdminPanel />}>
    <Route index element={<OverviewPage />} />
    <Route path="products" element={<ProductsPage />} />
    <Route path="add-Products" element={<AddProduct />} />
    <Route path="users" element={<UsersPage />} />
    <Route path="sales" element={<SalesPage />} />
    <Route path="orders" element={<OrdersPage />} />
    <Route path="shipping-price" element={<ShippingPriceControl/>} />
  </Route>
)}

      </Routes>
    </BrowserRouter>
  );
};

// Render the app
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
