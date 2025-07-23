import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageLimit = 2; // số trang hiện xung quanh currentPage

  const generatePages = () => {
    const pages = [];

    // Nếu tổng số trang nhỏ hơn 7 thì hiển thị hết luôn
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1); // Luôn có trang đầu

      if (currentPage > pageLimit + 2) pages.push("...");

      const start = Math.max(2, currentPage - pageLimit);
      const end = Math.min(totalPages - 1, currentPage + pageLimit);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - pageLimit - 1) pages.push("...");
      pages.push(totalPages); // Luôn có trang cuối
    }

    return pages;
  };

  const handlePageChange = (page) => {
    if (page === "..." || page === currentPage) return;
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="custom-pagination mt-4">
      <ul className="pagination justify-content-center">
        {/* Về đầu */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(1)}>
            <i className="fa-solid fa-angles-left"></i>
          </button>
        </li>

        {/* Các nút trang */}
        {generatePages().map((page, index) => (
          <li
            key={index}
            className={`page-item ${page === currentPage ? "active" : ""} ${
              page === "..." ? "disabled" : ""
            }`}
          >
            <button className="page-link" onClick={() => handlePageChange(page)}>
              {page}
            </button>
          </li>
        ))}

        {/* Về cuối */}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(totalPages)}>
            <i className="fa-solid fa-angles-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
