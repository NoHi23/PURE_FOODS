import React from "react";

const FilterStatus = ({ selectedStatus, setSelectedStatus }) => {
  const options = [
    { label: "Tất cả", value: "all" },
    { label: "Đang xử lý", value: 0 },
    { label: "Đã hoàn thành", value: 1 },
    { label: "Bị từ chối", value: 2 },
  ];

  return (
    <div className="d-flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`btn btn-sm ${
            selectedStatus === opt.value ? "btn-primary" : "btn-outline-secondary"
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
