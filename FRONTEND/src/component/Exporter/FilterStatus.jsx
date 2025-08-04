// FilterStatus.jsx (No changes needed)
import React from "react";

const FilterStatus = ({ selectedStatus, setSelectedStatus }) => {
  // Danh sách options đầy đủ theo yêu cầu
  const options = [
    { label: "Tất cả", value: "all" },
    { label: "Chờ xử lý", value: "pending" },
    { label: "Đang xử lý", value: "processing" },
    { label: "Đã giao hàng", value: "shipped" },
    { label: "Đã giao", value: "delivered" },
    { label: "Đã hủy", value: "cancelled" },
  ];

  return (
    <div className="d-flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`btn btn-sm fw-bold me-2 ${
            selectedStatus === opt.value ? "btn-primary border" : "btn-light border"
          }`}
          onClick={() => setSelectedStatus(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default FilterStatus;