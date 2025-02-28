import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const backendUrl = import.meta.env.BACKEND_URL
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    
    
    try {
      const response = await fetch(`${backendUrl}/auth/reset-password-request`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
          alert(data.message);
          sessionStorage.setItem("resetEmail", email); // Store email in sessionStorage
          navigate("/confirmCode"); // Redirect to confirm code page
      } else {
          alert(data.error);
      }
  } catch (error) {
      setLoading(false);
      alert("Server error. Please try again.");
  }
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
              Forgot your password?
            </h1>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                  placeholder="name@company.com"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer text-white font-medium rounded-lg text-sm px-5 py-3 
                bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 
                transition-all duration-300 ease-in-out transform hover:scale-101 shadow-lg"
              >
                Send Reset Instructions
              </button>
            </form>

            <div className="flex items-center justify-between">
              <Link to="/login" className="text-sm text-white relative group">
                Back to Sign In
                <span className="absolute bottom-0 left-0 w-full h-[0.2px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;
