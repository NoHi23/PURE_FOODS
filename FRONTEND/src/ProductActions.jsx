import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const REQUIRED_COLUMNS = ['productName', 'categoryID', 'supplierID', 'price', 'stockQuantity', 'imageIRL', 'status'];

const ProductActions = ({ setProducts, products }) => {
  const fileInputRef = useRef();

  const handleImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      const columns = Object.keys(jsonData[0] || {});
      const isValid = REQUIRED_COLUMNS.every(col => columns.includes(col));
      if (!isValid) {
        toast.warn('File Excel không đúng định dạng. Vui lòng kiểm tra lại các cột!');
        return;
      }
      setProducts(jsonData); // Cập nhật danh sách sản phẩm
    };

    reader.readAsBinaryString(file);
  };

  const handleExport = () => {
    if (!products || products.length === 0) {
      toast.warn("Không có dữ liệu để xuất!");
      return;
    }

    // Chỉ xuất các cột cần thiết (có thể tùy chỉnh theo yêu cầu)
    const exportData = products.map(p => ({
      productName: p.productName,
      categoryID: p.categoryId,
      supplierID: p.supplierId,
      price: p.price,
      stockQuantity: p.stockQuantity,
      imageIRL: p.imageURL,
      status: p.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    XLSX.writeFile(workbook, 'products_export.xlsx');
  };

  return (
    <div className="card card-table">
      <div className="card-body">
        <div className="title-header option-title d-sm-flex d-block">
          <div className="right-options">
            <ul>
              <li>
                <a href="" onClick={() => fileInputRef.current.click()}>Import</a>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".xlsx, .xls"
                  onChange={handleImport}
                  style={{ display: 'none' }}
                />
              </li>
              <li>
                <a  onClick={handleExport}>Export</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductActions;
