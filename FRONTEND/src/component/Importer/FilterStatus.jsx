import React from "react";

const FilterStatus = ({ selectedStatus, setSelectedStatus }) => {
  const options = [
    { label: "Tất cả", value: "all" },
    { label: "Đang xử lý", value: 0 },
    { label: "Đã hoàn thành", value: 1 },
    { label: "Bị từ chối", value: 2 },
    { label: "Chờ xác nhận trả hàng", value: 5 },
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
