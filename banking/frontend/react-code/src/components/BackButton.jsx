import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // Import an icon for the button

const BackButton = ({ to }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-black/90 mb-4"
    >
      <ArrowLeft className="w-5 h-5" />
      <span>Back</span>
    </button>
  );
};

export default BackButton;