import React from 'react';

const FilterStatus = ({ selectedStatus, setSelectedStatus }) => {
  return (
    <div className="form-floating theme-form-floating">
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="form-control"
        style={{ borderRadius: "8px", padding: "10px" }}
      >
        <option value="all">Tất cả</option>
        <option value="1">Đang chờ xử lý</option>
        <option value="2">Đang xử lý</option>
        <option value="3">Hoàn thành</option>
        <option value="4">Đang giao hàng</option>
        <option value="5">Đã hủy</option>
      </select>
      <label>Lọc trạng thái</label>
    </div>
  );
};

export default FilterStatus;