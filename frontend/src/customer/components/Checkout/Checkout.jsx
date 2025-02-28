import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStep } from "../../../reduxStore/features/userSlice";
import citiesByProvince from "./citiesByProvince";
import paymentMethods from "./paymentMethods";
import { setCartItems } from "../../../reduxStore/features/cartSlice";
import { backendUrl } from "../../../assets/assets";
import CryptoJS from "crypto-js";


const Checkout = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethods[0]?.id
  );
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    country: "Pakistan",
    city: "",
    phone_number: "",
    province: "",
    address: "",
    zip_code: "",
  });

  const currentStep = useSelector((state) => state.user.currentStep);
  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const customerOrders = useSelector((state) => state.user.customerOrders);
  const dispatch = useDispatch();

  const [shippingPrice, setShippingPrice] = useState(0);

  // Fetch Shipping Price when Province or City changes
  useEffect(() => {
    console.log("DAta chnging agya");

    if (userDetails.province && userDetails.city) {
      fetch(
        `${backendUrl}/admin/shipping-price?province=${userDetails.province}&city=${userDetails.city}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("data from backend", data.price);
          console.log("data from ship before", shippingPrice);
          setShippingPrice(data.price);
          console.log("data from ship after", shippingPrice);
        })
        .catch((error) => {
          console.error("Error fetching shipping price:", error);
          setShippingPrice(0); // Fallback to 0 if error occurs
        });
    }
  }, [userDetails.province, userDetails.city]);

  // Calculate Grand Total including Shipping
  const calculateGrandTotal = () => {
    return calculateTotal() + shippingPrice;
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
    if (loggedInUser) {
      const customerData = customerOrders.find(
        (order) => order.customerId === loggedInUser.customerId
      );
      if (customerData) {
        dispatch(setCartItems(customerData.products || [])); // Ensure no undefined or null values
      }
    }
  }, [loggedInUser, customerOrders, dispatch]);


  // Function to move to the next step
  const handleNextStep = () => {
    dispatch(setCurrentStep(currentStep + 1)); // Increment the step
  };


  // Function to go back to the previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      dispatch(setCurrentStep(currentStep - 1)); // Decrement the step
    }
  };


  // Handle changes in user input fields
  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };


  // Handle province change and update available cities accordingly
  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      province: selectedProvince,
      city: "", // Reset city when province changes
    }));
    setAvailableCities(citiesByProvince[selectedProvince] || []);
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (id) => {
    setSelectedPaymentMethod(id);
  };

  // Handle delivery method selection
  const handleDeliveryMethodChange = (id) => {
    setSelectedDeliveryMethod(id);
  };

  const handlePaymentProceed = () => {
    console.log(`Proceeding to payment with ${selectedPaymentMethod}`);
  
    switch (selectedPaymentMethod) {
      case "jazzcash":
        alert("Redirecting to JazzCash Payment Gateway...");
  
        const merchantID = "MC149245"; // Your Merchant ID
        const integritySalt = "83v77r44r3"; // Your Integrity Salt
        const password = "G7T42V0D"; // Your Password
        const returnURL = "http://localhost:5173/order-summary"; // Your Return URL
        const txnRefNo = `T${Date.now()}`; // Unique Transaction ID
        const amount = 100 * 100; // Amount in Paisa (PKR 100 = 10000 Paisa)
  
        const payload = {
          pp_Version: "1.1",
          pp_TxnType: "MWALLET",
          pp_Language: "EN",
          pp_MerchantID: merchantID,
          pp_Password: password,
          pp_TxnRefNo: txnRefNo,
          pp_Amount: amount.toString(),
          pp_TxnCurrency: "PKR",
          pp_TxnDateTime: new Date().toISOString().replace(/[-:.T]/g, "").slice(0, 14),
          pp_BillReference: "Invoice12345",
          pp_Description: "Test Transaction",
          pp_ReturnURL: returnURL,
          ppmpf_1: "03123456789",
          ppmpf_2: "ExtraField2",
          ppmpf_3: "ExtraField3",
          pp_SecureHash: "" // Placeholder for Secure Hash
        };
  
        // Function to Generate Hash
        const generateHash = (payload, salt) => {
          let hashString = "";
          const keys = Object.keys(payload).sort();
          keys.forEach((key) => {
            if (payload[key] !== "" && key !== "pp_SecureHash") {
              hashString += `${payload[key]}&`;
            }
          });
          hashString = salt + "&" + hashString.slice(0, -1); // Prepend Salt and Remove last "&"
          console.log("Hash String: ", hashString);
  
          return CryptoJS.HmacSHA256(hashString, salt).toString();
        };
  
        // Calculate Secure Hash
        payload.pp_SecureHash = generateHash(payload, integritySalt);
  
        // Create Form
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/";

        for (let key in payload) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = payload[key];
          form.appendChild(input);
        }
  
        document.body.appendChild(form);
        form.submit();
        break;
  
      default:
        alert("Unknown Payment Method");
    }
    setCurrentStep(3);
  };
  
  // const generateHash = (data, salt) => {
  //   let hashString = "";
  //   const sortedKeys = Object.keys(data).sort();
  
  //   sortedKeys.forEach((key) => {
  //     hashString += data[key] + "&";
  //   });
  
  //   hashString += salt; // Append the Integrity Salt at the end
  
  //   return CryptoJS.SHA256(hashString).toString(CryptoJS.enc.Hex);
  // };
  

  useEffect(() => {
    // Only set to step 2 if not already set
    if (currentStep !== 2) {
      dispatch(setCurrentStep(2)); // Set to Checkout step when navigating to checkout
    }
  }, [dispatch, currentStep]);

  // Handle the browser's back/forward button navigation
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.includes("checkout") && currentStep !== 2) {
        dispatch(setCurrentStep(2)); // Ensure we're at the Checkout step when moving forward to it
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentStep, dispatch]);

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <form action="#" className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <ol className="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
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

        <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
          {/* Left Section: Input Fields & Payment Methods */}
          <div className="lg:w-2/3 space-y-8">
            {/* Delivery Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Delivery Details
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label
                    htmlFor="your_name"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {" "}
                    Your name{" "}
                  </label>
                  <input
                    type="text"
                    id="your_name"
                    name="name"
                    value={userDetails.name}
                    onChange={handleUserDetailsChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="Bonnie Green"
                    required
                  />
                </div>

                {/* Zip Code */}
                <div>
                  <label
                    htmlFor="zip_code"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {" "}
                    Zip Code{" "}
                  </label>
                  <input
                    type="text"
                    id="zip_code"
                    name="zip_code"
                    value={userDetails.zip_code}
                    onChange={handleUserDetailsChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="12345"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {" "}
                    Email{" "}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userDetails.email}
                    onChange={handleUserDetailsChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="example@domain.com"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {" "}
                    Address{" "}
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={userDetails.address}
                    onChange={handleUserDetailsChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="123 Main St, Lahore"
                    required
                  />
                </div>

                {/* Phone Number (with +92 prefix) */}
                <div>
                  <label
                    htmlFor="phone_number"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {" "}
                    Phone Number{" "}
                  </label>
                  <input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    value={userDetails.phone_number}
                    onChange={handleUserDetailsChange}
                    maxLength="13"
                    placeholder="+92 xxxxxxxxxx"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    required
                  />
                </div>

                {/* Country */}
                <div>
                  <label
                    htmlFor="country"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {" "}
                    Country{" "}
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value="Pakistan"
                    readOnly
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  />
                </div>

                {/* Province */}
                <div>
                  <label
                    htmlFor="province"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {" "}
                    Province{" "}
                  </label>
                  <select
                    id="province"
                    name="province"
                    value={userDetails.province}
                    onChange={handleUserDetailsChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    required
                  >
                    <option value="">Select a Province</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="Khyber Pakhtunkhwa">
                      Khyber Pakhtunkhwa
                    </option>
                    <option value="Balochistan">Balochistan</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {" "}
                    City{" "}
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={userDetails.city}
                    onChange={handleUserDetailsChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    required
                  >
                    <option value="">Select a City</option>
                    {citiesByProvince[userDetails.province]?.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Payment
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id={method.id}
                          type="radio"
                          name="payment-method"
                          value={method.id}
                          className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                          checked={selectedPaymentMethod === method.id}
                          onChange={() => handlePaymentMethodChange(method.id)}
                        />
                      </div>
                      <div className="ms-4 text-sm">
                        <label
                          htmlFor={method.id}
                          className="font-medium leading-none text-gray-900 dark:text-white"
                        >
                          {method.name}
                        </label>
                        <p
                          id={`${method.id}-text`}
                          className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                        >
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section: Order Summary */}
          <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Order Summary
            </h2>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between gap-4 py-3">
                <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                  Cart Total
                </span>
                <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                  {" "}
                  {calculateTotal().toFixed(2)} Rs
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 py-3">
                <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                  Shipping
                </span>
                <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                  {shippingPrice.toFixed(2)} Rs
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 py-3">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Grand Total
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {calculateGrandTotal().toFixed(2)} Rs
                </span>
              </div>
            </div>

            {/* Payment Button */}
            <div className="bg-green-500 cursor-pointer w-full rounded-lg p-2">
              <button
                type="button"
                onClick={() => {
                  handlePaymentProceed();
                  handleNextStep();
                }}
                className="w-full rounded-lg cursor-pointer bg-primary-500 py-3 text-white text-lg"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Checkout;
