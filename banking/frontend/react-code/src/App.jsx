import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AccountsList from "./pages/AccountList";
import AccountDetail from "./pages/AccountDetail";
import UserManagement from "./pages/UserManagement";
import TransactionsList from "./pages/TransactionsList";
import TransactionDetail from "./pages/TransactionDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/accounts" element={<AccountsList />} />
      <Route path="/account/:id" element={<AccountDetail />} />
      <Route path="/users/:id" element={<UserManagement />} />
      <Route path="/transactions" element={<TransactionsList />} />
      <Route path="/transaction/:id" element={<TransactionDetail />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}
