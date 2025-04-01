import { useNavigate } from "react-router-dom";
import LoginButton from "../components/LoginButton";
import Box from "../components/Box";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="relative flex items-center justify-center bg-gray-100 border-none">
      <Box />

      <div className="relative flex w-2200pxx h-2500px bg-white rounded-xl shadow-lg overflow-hidden">
        <div className=" md:flex items-center justify-center bg-black p-8">
          <img
            src="./public/logo.svg"
            alt="CREDIT UNION BANK"
            className="w-100 h-auto object-contain bg-transparent border-none"
          />
        </div>

        <div className="w-full md:w-2200px p-8 border-hidden">
          <h3 className="text-gray-600 items-center text-sm mb-6 xc">
            Please fill in your unique admin login details below
          </h3>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 items-center border-none">
                Username
              </label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-2 bg-input border border-hidden text-foreground rounded-md"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 border-hidden">
                Password
              </label>
              <input
                type="password"
                className="w-full mt-1 px-4 py-2 bg-input border border-border text-foreground rounded-md border-hidden"
                placeholder="Enter your password"
              />
            </div>

            <div className="text-right text-sm text-gray-500 border-hidden">
              <a href="#" className="hover:underline">
                forgot password?
              </a>
            </div>

            <LoginButton className="relative items-center">Sign In</LoginButton>
          </form>
        </div>
      </div>
    </div>
  );
}
