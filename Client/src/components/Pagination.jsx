import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPages = () => {
    const pages = [];
    const maxVisible = 10;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex justify-end items-center gap-2 mt-6 text-sm select-none">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-3 py-2 rounded-full border transition-all duration-200 ${
          currentPage === 1
            ? "cursor-not-allowed text-gray-400 border-gray-300"
            : "hover:bg-yellow-200 border-gray-400"
        }`}
      >
        <FaChevronLeft />
      </button>

      {getPages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-200 border ${
            currentPage === page
              ? "bg-[#FFC107] text-white border-[#FFC107] scale-100 shadow-md"
              : "hover:bg-yellow-100 text-gray-700 border-gray-300"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-3 py-2 rounded-full border transition-all duration-200 ${
          currentPage === totalPages
            ? "cursor-not-allowed text-gray-400 border-gray-300"
            : "hover:bg-yellow-200 border-gray-400"
        }`}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
