import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";
import Pagination from "../../layouts/Pagination";

const ExporterProduct = ({ currentPage, setCurrentPage }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = products.filter((p) => 
    p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.stockQuantity?.toString().includes(searchTerm)
  );

  const productsPerPage = 7;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    console.log("ExporterProduct mounted");
    const fetchData = async () => {
      const exporterId = JSON.parse(localStorage.getItem("user"))?.userID || 1;
      try {
        const [productsRes, ordersRes] = await Promise.all([
          axios.get(`http://localhost:8082/PureFoods/api/product/getAll`),
          axios.get(`http://localhost:8082/PureFoods/api/exporter/orders/${exporterId}?page=0&size=10`),
        ]);
        console.log("Products:", productsRes.data);
        console.log("Orders:", ordersRes.data);
        setProducts(productsRes.data.listProduct || []);
        setOrders(ordersRes.data || []);
      } catch (err) {
        toast.error("Lỗi khi lấy dữ liệu: " + err.response?.data?.message || err.message);
      }
    };
    fetchData();
  }, []);

  const handleExport = async (productId, quantity, orderId) => {
    if (!orderId) {
      toast.error("Vui lòng chọn một đơn hàng!");
      return;
    }
    const exporterId = JSON.parse(localStorage.getItem("user"))?.userID || 1;
    try {
      await axios.post(`http://localhost:8082/PureFoods/api/exporter/export-from-inventory`, null, {
        params: { exporterId, orderId, productId, quantity },
      });
      toast.success("Xuất kho thành công!");
      setProducts((prev) => prev.map((p) => p.productId === productId ? { ...p, stockQuantity: p.stockQuantity - quantity } : p));
    } catch (err) {
      toast.error("Xuất kho thất bại: " + err.response?.data?.message || err.message);
    }
  };

  const handleManageInventory = async (productId, action, quantity) => {
    const exporterId = JSON.parse(localStorage.getItem("user"))?.userID || 1;
    try {
      await axios.post(`http://localhost:8082/PureFoods/api/exporter/inventory`, null, {
        params: { exporterId, productId, quantity, action },
      });
      if (action === "delete") {
        setProducts((prev) => prev.filter((p) => p.productId !== productId));
        toast.success("Xóa sản phẩm thành công!");
      } else if (action === "update") {
        setProducts((prev) => prev.map((p) => p.productId === productId ? { ...p, stockQuantity: quantity } : p));
        toast.success("Cập nhật số lượng thành công!");
      }
    } catch (err) {
      toast.error(`Thao tác thất bại: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="product-tab">
      <div className="title">
        <h2>Tất cả sản phẩm trong kho</h2>
        <span className="title-leaf">
          <svg className="icon-width bg-gray">
            <use href="../assets/svg/leaf.svg#leaf"></use>
          </svg>
        </span>
      </div>
      <div className="position-relative mb-4">
        <input
          type="text"
          className="form-control pe-5"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
        <FiSearch style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", color: "#aaa", pointerEvents: "none" }} size={18} />
      </div>
      <div className="table-responsive dashboard-bg-box">
        <table className="table product-table">
          <thead>
            <tr>
              <th scope="col">Tên sản phẩm</th>
              <th scope="col">Số lượng</th>
              <th scope="col">Xuất kho</th>
              <th scope="col">Quản lý</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <tr key={product.productId}>
                  <td><h6>{product.productName}</h6></td>
                  <td><h6>{product.stockQuantity}</h6></td>
                  <td>
                    <select onChange={(e) => {
                      if (e.target.value) {
                        const [quantity, orderId] = e.target.value.split('-').map(Number);
                        handleExport(product.productId, quantity, orderId);
                      }
                    }}>
                      <option value="">Chọn số lượng và đơn hàng</option>
                      {orders.length > 0 ? (
                        orders.map(o => 
                          [...Array(Math.min(product.stockQuantity, 10)).keys()].map(i => (
                            <option key={`${i + 1}-${o.orderID}`} value={`${i + 1}-${o.orderID}`}>
                              {i + 1} (Đơn hàng #{o.orderID})
                            </option>
                          ))
                        )
                      ) : (
                        <option value="" disabled>Không có đơn hàng</option>
                      )}
                    </select>
                  </td>
                  <td>
                    <input type="number" placeholder="Số lượng mới" onChange={(e) => setSelectedProduct({ ...product, newQuantity: e.target.value })} />
                    <button onClick={() => handleManageInventory(product.productId, "update", selectedProduct?.newQuantity || product.stockQuantity)}>Cập nhật</button>
                    <button onClick={() => handleManageInventory(product.productId, "delete", 0)}>Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">Không có sản phẩm nào.</td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default ExporterProduct;