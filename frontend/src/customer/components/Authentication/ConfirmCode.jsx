import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../../../assets/assets";
function ConfirmCode() {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60); // 1-minute timer
  const navigate = useNavigate();
  
  // Retrieve email from session storage
  const email = sessionStorage.getItem("resetEmail");

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setError("Code expired. Please request a new reset code.");
    }
  }, [timer]);

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Check if email exists in session storage
    if (!email) {
      setError("Session expired. Please request a new reset code.");
      navigate("/forgotPassword");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/auth/confirm-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resetCode: code }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        navigate("/resetPassword");
      } else {
        setError(data.error);
      }
    } catch (error) {
      setLoading(false);
      setError("Server error. Please try again later.");
    }
  };

  const API_URL = import.meta.env.VITE_API_URL;
 
  const handleResendCode = async () => {
    setResending(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/resend-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setTimer(60); // Reset timer
        setError("A new code has been sent to your email.");
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    }

    setTimeout(() => setResending(false), 5000); // Disable button for 5 seconds
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 w-full">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          ZFSTUDIO
        </a>
        <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-6 md:space-y-8 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Enter the Confirmation Code
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Time remaining: {timer}s</p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Confirmation Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={code}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                  placeholder="Enter your code"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer text-white font-medium rounded-lg text-sm px-5 py-3 
             bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 
             transition-all duration-300 ease-in-out transform hover:scale-101 shadow-lg"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Confirm Code"}
              </button>
            </form>

            {/* ✅ Resend Code Button */}
            <button
              onClick={handleResendCode}
              className="w-full text-sm text-blue-500 hover:underline mt-2 disabled:text-gray-400"
              disabled={resending}
            >
              {resending ? "Resending..." : "Resend Code"}
            </button>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ConfirmCode;
