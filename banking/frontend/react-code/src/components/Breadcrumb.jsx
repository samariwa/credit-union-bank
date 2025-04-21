import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ items }) => {
  return (
    <nav className="text-lg text-gray-500 mb-4 flex items-center space-x-2"> {/* Increased font size */}
      {items.map((item, index) => (
        <span key={index} className="flex items-center">
          {item.to ? (
            <Link to={item.to} className="text-gray-500 hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-semibold">{item.label}</span>
          )}
          {index < items.length - 1 && <span className="mx-2">&gt;</span>}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;