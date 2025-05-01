import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import LoginButton from "../components/LoginButton";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/register/", // Updated endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      // Navigate to login page on successful registration
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="flex flex-col md:flex-row items-center justify-center gap-12">
        <div className="flex items-center justify-center">
          <img
            src={logo}
            alt="CREDIT UNION BANK"
            className="w-[600px] md:w-[800px] h-auto object-contain"
          />
        </div>

        <div className="relative z-10 w-[660px] md:w-[600px] bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-gray-600 text-sm mb-6">
            Please fill in your details below to create an account
          </h3>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 bg-input border border-border text-foreground rounded-md"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 bg-input border border-border text-foreground rounded-md"
                placeholder="Enter your password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 bg-input border border-border text-foreground rounded-md"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 bg-input border border-border text-foreground rounded-md"
                placeholder="Enter your first name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 bg-input border border-border text-foreground rounded-md"
                placeholder="Enter your last name"
                required
              />
            </div>

            <LoginButton>Register</LoginButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
