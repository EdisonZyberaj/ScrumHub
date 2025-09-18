import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaChartLine } from "react-icons/fa";
import { BsKanban, BsCalendarCheck } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("All fields are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setError("Invalid email format.");
      return;
    }

    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await axios.post(
        "http:
        {
          email: trimmedEmail,
          password: trimmedPassword,
        }
      );

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        navigate("/"); 
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-light to-white px-4">
      <div className="flex bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-4xl">
        <div className="w-1/2 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary flex items-center justify-center text-white text-2xl font-bold rounded-lg mb-4">SH</div>
            <h1 className="text-2xl font-bold text-gray-800">Login to ScrumHub</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-gray-700 font-medium">
                  Password
                </label>
                <a href="#" className="text-sm text-primary hover:text-accent">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-accent transition-colors font-medium"
            >
              Sign In
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center border border-gray-300 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <FcGoogle className="mr-2 text-lg" />
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center border border-gray-300 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <FaGithub className="mr-2 text-lg" />
              <span>GitHub</span>
            </button>
          </div>

          <p className="text-center text-gray-600 mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:text-accent">
              Sign up
            </Link>
          </p>
        </div>
        
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-primary to-dark p-12 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
          <p className="mb-8">
            Log in to access your Scrum projects, track your team's progress, and deliver value incrementally.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                <BsKanban className="text-white" />
              </div>
              <span>Visualize your team's workflow</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                <BsCalendarCheck className="text-white" />
              </div>
              <span>Manage sprints and backlog</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                <FaChartLine className="text-white" />
              </div>
              <span>Track progress with real-time analytics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;