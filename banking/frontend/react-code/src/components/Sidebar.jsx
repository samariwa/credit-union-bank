import {
  Home,
  BarChart2,
  Wallet,
  User,
  Settings,
  Shield,
  HelpCircle,
  CreditCard,
  FileText,
  Briefcase,
} from "lucide-react";
import logo from "../assets/logo.svg";
import avatar from "../assets/avatar.png";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const navItems = [
  { icon: Home, label: "Dashboard", to: "/dashboard" },
  { icon: BarChart2, label: "Analytics", to: "/analytics" },
  { icon: CreditCard, label: "Accounts", to: "/accounts" },
  { icon: FileText, label: "Transactions", to: "/transactions" },
  { icon: Briefcase, label: "Businesses", to: "/businesses" },
  { icon: User, label: "Users", to: "/users" },
];

export default function Sidebar() {
  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/api/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <aside className="w-[300px] h-screen bg-black text-white flex flex-col justify-between py-6 px-4">
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
        {users.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            <ul className="space-y-2">
              {users.map((user) => (
                <li key={user.user.id} className="text-gray-400">
                  {user.user.username} ({user.user.email})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 px-4">
        {userInfo ? (
          <div className="flex items-center gap-3">
            <img
              src={avatar}
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
    </aside>
  );
}
