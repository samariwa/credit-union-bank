import {
  Home,
  BarChart2,
  Wallet,
  User,
  Settings,
  Shield,
  HelpCircle,
} from "lucide-react";
import logo from "../assets/logo.svg";
import { NavLink } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Dashboard", to: "/dashboard" },
  { icon: BarChart2, label: "Analytics", to: "/analytics" },
  { icon: Wallet, label: "Wallet", to: "/wallet" },
  { icon: User, label: "Profile", to: "/profile" },
  { icon: Settings, label: "Settings", to: "/settings" },
  { icon: Shield, label: "Security", to: "/security" },
  { icon: HelpCircle, label: "Help", to: "/help" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-black text-white flex flex-col justify-between py-6 px-4">
      <div>
        <div className="flex items-center justify-center mb-10">
          <img src={logo} alt="Logo" className="w-32 h-auto object-contain" />
        </div>
        <nav className="space-y-2">
          {/* eslint-disable-next-line no-unused-vars */}
          {navItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-white/10 ${
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
          <p className="text-sm font-semibold">Lora Lewis</p>
          <p className="text-xs text-gray-400">Branch Manager</p>
        </div>
      </div>
    </aside>
  );
}
