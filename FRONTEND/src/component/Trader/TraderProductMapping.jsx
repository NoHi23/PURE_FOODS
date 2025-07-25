import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import Pagination from "../TraderLayout/Pagination";

const TraderProductMapping = ({ traderId }) => {
  const [products, setProducts] = useState([]);
  const [traderProducts, setTraderProducts] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [productId, setProductId] = useState("");
  const [traderProductId, setTraderProductId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState({ productId: "", traderProductId: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(mappings.length / itemsPerPage);

  const paginatedMappings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return mappings.slice(start, start + itemsPerPage);
  }, [mappings, currentPage]);

  useEffect(() => {
    if (!traderId) {
      setError("Vui lòng đăng nhập để quản lý ánh xạ sản phẩm");
      setLoading(false);
      return;
    }

    const source = axios.CancelToken.source();
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, traderProductsRes, mappingsRes] = await Promise.all([
          axios.get("http://localhost:8082/PureFoods/api/product/getAll", { withCredentials: true, cancelToken: source.token }),
          axios.get(`http://localhost:8082/PureFoods/api/trader/inventory?userId=${traderId}`, { withCredentials: true, cancelToken: source.token }),
          axios.get("http://localhost:8082/PureFoods/api/trader-product-mapping/get-all", { withCredentials: true, cancelToken: source.token }),
        ]);

        if (
          !Array.isArray(productsRes.data.listProduct) ||
          !Array.isArray(traderProductsRes.data.data) ||
          !Array.isArray(mappingsRes.data)
        ) {
          throw new Error("Dữ liệu phản hồi không hợp lệ");
        }

        setProducts(productsRes.data.listProduct);
        setTraderProducts(traderProductsRes.data.data);
        setMappings(mappingsRes.data);
        setError(null);
      } catch (err) {
        if (!axios.isCancel(err)) {
          const message = err.response?.data?.message || err.message || "Lỗi khi tải dữ liệu";
          setError(message);
          toast.error(message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => source.cancel();
  }, [traderId]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages || 1);
  }, [mappings, currentPage, totalPages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = { productId: "", traderProductId: "" };
    if (!productId) errors.productId = "Vui lòng chọn sản phẩm";
    if (!traderProductId) errors.traderProductId = "Vui lòng chọn sản phẩm trader";

    setFormErrors(errors);
    if (errors.productId || errors.traderProductId) {
      toast.warn("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "http://localhost:8082/PureFoods/api/trader-product-mapping/create",
        null,
        {
          params: { userId: traderId, productId, traderProductId },
          withCredentials: true,
        }
      );
      toast.success("Tạo ánh xạ thành công");
      setMappings((prev) => [...prev, response.data]);
      setProductId("");
      setTraderProductId("");
      setFormErrors({ productId: "", traderProductId: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi tạo ánh xạ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (mappingId) => {
    if (!window.confirm("Bạn có chắc muốn xoá ánh xạ này?")) return;
    try {
      await axios.delete(
        `http://localhost:8082/PureFoods/api/trader-product-mapping/delete/${mappingId}`,
        { withCredentials: true }
      );
      toast.success("Xoá thành công");
      setMappings((prev) => prev.filter((m) => m.mappingId !== mappingId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi xoá ánh xạ");
    }
  };

  if (loading) return <div className="text-center py-10 text-lg text-gray-600">⏳ Đang tải dữ liệu...</div>;
  if (error) return <div className="text-center text-red-600 py-10">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">📦 Quản lý ánh xạ sản phẩm</h2>

      {/* Form ánh xạ */}
      <div className="bg-white shadow-2xl rounded-2xl p-8 mb-10 border border-gray-100">
        <h3 className="text-xl font-semibold mb-6 text-gray-700 text-center">🛠️ Tạo ánh xạ sản phẩm</h3>
        <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sản phẩm (Importer)</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className={`w-full p-3 border ${formErrors.productId ? 'border-red-500' : 'border-gray-200'} rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400`}
            >
              <option value="" disabled>-- Chọn sản phẩm --</option>
              {products.map((p) => (
                <option key={p.productId} value={p.productId}>
                  {p.productName} (ID: {p.productId})
                </option>
              ))}
            </select>
            {formErrors.productId && (
              <p className="text-red-500 text-xs mt-1 animate-pulse">{formErrors.productId}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sản phẩm của Trader</label>
            <select
              value={traderProductId}
              onChange={(e) => setTraderProductId(e.target.value)}
              className={`w-full p-3 border ${formErrors.traderProductId ? 'border-red-500' : 'border-gray-200'} rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400`}
            >
              <option value="" disabled>-- Chọn sản phẩm trader --</option>
              {traderProducts.map((p) => (
                <option key={p.traderProductId} value={p.traderProductId}>
                  {p.productName} (ID: {p.traderProductId})
                </option>
              ))}
            </select>
            {formErrors.traderProductId && (
              <p className="text-red-500 text-xs mt-1 animate-pulse">{formErrors.traderProductId}</p>
            )}
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 rounded-lg shadow-md font-medium text-white transition-all duration-300 flex items-center justify-center space-x-2
                ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <span>➕ Tạo ánh xạ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Danh sách ánh xạ */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 text-center">📄 Danh sách ánh xạ</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Mã ánh xạ</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Sản phẩm (Importer)</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Sản phẩm Trader</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMappings.length > 0 ? (
                paginatedMappings.map((mapping) => {
                  const importer = products.find((p) => p.productId === mapping.productId);
                  const trader = traderProducts.find((tp) => tp.traderProductId === mapping.traderProductId);
                  return (
                    <tr key={mapping.mappingId} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{mapping.mappingId}</td>
                      <td className="border border-gray-300 px-4 py-2">{importer?.productName || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">{trader?.productName || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <button
                          onClick={() => handleDelete(mapping.mappingId)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          🗑️ Xoá
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-4">Không có ánh xạ nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

TraderProductMapping.propTypes = {
  traderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default TraderProductMapping;