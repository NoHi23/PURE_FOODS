import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const generatePages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <nav className="custom-pagination mt-4">
      <ul className="pagination justify-content-center">
        {/* Nút về đầu */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(1)}>
            <i className="fa-solid fa-angles-left"></i>
          </button>
        </li>

        {/* Các số trang */}
        {generatePages().map((page) => (
          <li
            key={page}
            className={`page-item ${currentPage === page ? 'active' : ''}`}
          >
            <button className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </button>
          </li>
        ))}

        {/* Nút về cuối */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(totalPages)}>
            <i className="fa-solid fa-angles-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
