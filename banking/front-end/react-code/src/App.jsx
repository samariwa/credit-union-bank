
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/AdminLogin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
