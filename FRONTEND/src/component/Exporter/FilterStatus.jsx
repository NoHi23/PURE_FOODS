import React from 'react';

const FilterStatus = ({ selectedStatus, setSelectedStatus }) => {
  return (
    <div>
      <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
        <option value="all">Tất cả</option>
        <option value="0">Đang xử lý</option>
        <option value="1">Hoàn thành</option>
        <option value="2">Từ chối</option>
      </select>
    </div>
  );
};

export default FilterStatus;