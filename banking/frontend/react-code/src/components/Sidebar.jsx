import {
  Home,
  BarChart2,
  Wallet,
  User,
  Settings,
  Shield,
  HelpCircle,
  CreditCard,
} from "lucide-react";
import logo from "../assets/logo.svg";
import avatar from "../assets/avatar.png"; // Import the avatar image
import { NavLink } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Dashboard", to: "/dashboard" },
  { icon: BarChart2, label: "Analytics", to: "/analytics" },
  { icon: Wallet, label: "Wallet", to: "/wallet" },
  { icon: CreditCard, label: "Accounts", to: "/accounts" },
  { icon: User, label: "Profile", to: "/profile" },
  { icon: Settings, label: "Settings", to: "/settings" },
  { icon: Shield, label: "Security", to: "/security" },
  { icon: HelpCircle, label: "Help", to: "/help" },
];

export default function Sidebar() {
  const userInfo = JSON.parse(localStorage.getItem("user_info"));

  return (
    <aside className="w-[400px] h-screen bg-black text-white flex flex-col justify-between py-6 px-4">
      <div>
        <div className="flex items-center justify-center mb-10">
          <img
            src={logo}
            alt="Logo"
            className="w-[900px] h-auto object-contain text-3xl"
          />
        </div>
        <nav className="space-y-2">
          {navItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-200 hover:bg-white/10 ${
                  isActive ? "bg-white/10 text-white" : "text-gray-400"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3 px-4">
        <div>
          {userInfo ? (
            <div className="flex items-center gap-3">
              <img
                src={avatar} // Use the imported avatar image
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-3xl font-semibold">{userInfo.username}</p>
                <p className="text-xl text-gray-400">
                  {userInfo.is_staff ? "Admin" : "User"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xl text-gray-400">Guest</p>
          )}
        </div>
      </div>
    </aside>
  );
}
