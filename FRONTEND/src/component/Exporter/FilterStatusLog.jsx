import React from "react";

const FilterStatusLog = ({ selectedStatus, setSelectedStatus }) => {
  // Danh sách options đã được rút gọn theo yêu cầu: tất cả, shipped (thành công, statusID=3), cancelled (hủy, statusID=5)
  const options = [
    { label: "Tất cả", value: "all" },
    { label: "Đã giao hàng", value: "shipped" },
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

export default FilterStatusLog;