import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import LoginButton from "../components/LoginButton";
import logo from "../assets/logo.svg";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/token/", {
        username,
        password,
      });

      const { access, refresh } = response.data;

      // 保存到 localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // 设置 Axios 的默认 Authorization 头部
      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      // 跳转到仪表盘
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please check your credentials.");
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
            Please fill in your unique admin login details below
          </h3>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-input border border-border text-foreground rounded-md"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-input border border-border text-foreground rounded-md"
                placeholder="Enter your password"
              />
            </div>

            <div className="text-right text-sm text-gray-500">
              <a href="#" className="hover:underline">
                forgot password?
              </a>
            </div>

            <LoginButton>Sign In</LoginButton>
          </form>
        </div>
      </div>
    </div>
  );
}
