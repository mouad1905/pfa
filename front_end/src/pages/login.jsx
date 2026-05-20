import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaAndroid, FaSignInAlt } from "react-icons/fa";


import { API_URLS } from "../api/api";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(API_URLS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: username, password }), // Laravel Auth Controller usually expects email
      });

      const data = await response.json();

      if (response.ok) {
        // Save token to localStorage
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        // Redirect based on role
        if (data.user?.role === "admin") {
          navigate("/admin");
        } else {
          // Redirect to profile with user ID
          navigate(`/profile/${data.user.id_user}`);
        }
      } else {
        setError(data.message || data.error || "Identifiants incorrects. Vérifiez votre email et mot de passe.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred during login. Is the server running?");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 mt-15 flex flex-col justify-center font-sans">
      {/* Main Content Container */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto shadow-2xl rounded-[20px] overflow-hidden bg-white">
          {/* Left Side: Company Info (Hidden on small screens like your CSS) */}
          <div className="hidden md:block lg:w-135 overflow-hidden">
            <img
              src="./src/assets/loginPicture.jpg" // Replace with your actual image path
              alt="Login Visual"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Side: Login Form */}
          <div className="w-full md:w-2/3 p-8 md:p-12">
            <div className="text-left mb-8 flex flex-row items-center gap-4">
              <FaSignInAlt className="text-3xl text-[#10b981] " />
              <h2 className="text-3xl font-bold text-[#10b981]">Log In</h2>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded text-sm text-center">
                  {error}
                </div>
              )}
              {/* Username Input */}
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username or Email"
                  className="w-full border-b border-gray-400 py-3 px-2 outline-none focus:border-[#008080] focus:ring-1 focus:ring-[#008080]/20 focus:rounded-md transition-all duration-500 placeholder-gray-500"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full border-b border-gray-400 py-3 px-2 outline-none focus:border-[#008080] focus:ring-1 focus:ring-[#008080]/20 focus:rounded-md transition-all duration-500 placeholder-gray-500"
                  required
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="remember_me"
                  id="remember_me"
                  className="h-4 w-4 accent-[#008080] cursor-pointer"
                />
                <label
                  htmlFor="remember_me"
                  className="text-gray-700 cursor-pointer text-sm font-medium"
                >
                  Remember Me!
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center md:justify-start">
                <button
                  type="submit"
                  className="w-full md:w-55 bg-white text-[#10b981] border border-[#008080] font-bold py-3 px-6 rounded-full hover:bg-[#10b981] hover:text-white transition-all cursor-pointer duration-500 shadow-md active:scale-95"
                >
                  Submit
                </button>
              </div>
            </form>

            {/* Registration Link */}
            <div className="mt-8 text-center md:text-left">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/register" // Replace with your actual registration page URL
                  className="text-[#10b981] font-semibold hover:underline"
                >
                  Register Here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
