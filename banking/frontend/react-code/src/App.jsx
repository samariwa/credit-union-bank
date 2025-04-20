import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AccountsList from "./pages/AccountList";
import AccountDetail from "./pages/AccountDetail";
import UserManagement from "./pages/UserManagement";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/accounts" element={<AccountsList />} />
      <Route path="/account/:id" element={<AccountDetail />} />
      <Route path="/users/:id" element={<UserManagement />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}
