import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../../../reduxStore/features/userSlice";
import { useDispatch } from "react-redux";

function Login({handleLogin}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Load saved email if rememberMe is checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
 
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch(`${backendUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Ensure cookies are sent
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
            }),
        });

        const data = await response.json();

        // Throw error if login failed
        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        // Persist login
        localStorage.setItem("user", JSON.stringify(data.user));
        handleLogin(data.user); // Update parent state (from main.jsx)
        dispatch(setUser(data.user)); // Store user in Redux

        // Handle "Remember Me" functionality
        if (formData.rememberMe) {
            localStorage.setItem("email", formData.email);
        } else {
            localStorage.removeItem("email");
        }

        alert("Login Successful!");
        navigate("/"); // Redirect to home page
    } catch (error) {
        console.error("Login Error:", error);
        alert(error.message);
    }
};


  // Handle Google Login Redirect
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`; // Redirect to Google OAuth route
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 w-full">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          ZFSTUDIO
        </a>
        <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-6 md:space-y-8 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                  placeholder="name@company.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50"
                />
                <label className="ml-3 text-sm font-light text-gray-500 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full cursor-pointer text-white font-medium rounded-lg text-sm px-5 py-3 
             bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 
             transition-all duration-300 ease-in-out transform hover:scale-101 shadow-lg"
            
              >
                Sign In
              </button>
            </form>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className=" cursor-pointer w-full flex items-center justify-center px-4 py-2 mt-3 border rounded-lg shadow-lg text-gray-700 bg-white hover:bg-gray-100 transition-all duration-300"
            >
              <img
                src="https://static.vecteezy.com/system/resources/previews/022/613/027/non_2x/google-icon-logo-symbol-free-png.png"
                alt="Google Logo"
                className="w-5 h-5 mr-2 "
              />
              Continue with Google
            </button>

            <div className="flex items-center justify-between">
              <Link to="/forgotPassword" className="text-sm text-white relative group">
                Forgot your password?
                <span className="absolute bottom-0 left-0 w-full h-[0.2px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
              </Link>
              <Link to="/signup" className="text-sm text-white relative group">
                Create an account
                <span className="absolute bottom-0 left-0 w-full h-[0.2px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
