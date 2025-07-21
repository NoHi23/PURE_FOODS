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

        if (!Array.isArray(productsRes.data.listProduct) ||
            !Array.isArray(traderProductsRes.data.data) ||
            !Array.isArray(mappingsRes.data)) {
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
    if (!productId || !traderProductId) {
      toast.warn("Vui lòng chọn đầy đủ sản phẩm");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8082/PureFoods/api/trader-product-mapping/create`,
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
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi tạo ánh xạ");
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

  if (loading) return <div className="text-center py-10 text-lg">⏳ Đang tải dữ liệu...</div>;
  if (error) return <div className="text-center text-red-600 py-10">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <h2 className="text-2xl font-bold text-center mb-6">📦 Quản lý ánh xạ sản phẩm</h2>

      {/* Form ánh xạ */}
      <div className="bg-white shadow rounded-xl p-6">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sản phẩm (Importer)</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
            >
              <option value="">-- Chọn sản phẩm --</option>
              {products.map((p) => (
                <option key={p.productId} value={p.productId}>
                  {p.productName} (ID: {p.productId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sản phẩm của Trader</label>
            <select
              value={traderProductId}
              onChange={(e) => setTraderProductId(e.target.value)}
              className="w-full p-2 border rounded focus:ring focus:ring-green-200"
            >
              <option value="">-- Chọn sản phẩm trader --</option>
              {traderProducts.map((p) => (
                <option key={p.traderProductId} value={p.traderProductId}>
                  {p.productName} (ID: {p.traderProductId})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
            >
              ➕ Tạo ánh xạ
            </button>
          </div>
        </form>
      </div>

      {/* Danh sách ánh xạ */}
      <div className="mt-8 bg-white shadow rounded-xl p-6">
        <h3 className="text-xl font-semibold text-center mb-4">📄 Danh sách ánh xạ</h3>
        {mappings.length === 0 ? (
          <p className="text-gray-500 text-center">Không có ánh xạ nào.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 font-medium">Mã ánh xạ</th>
                    <th className="px-4 py-2 font-medium">Sản phẩm (Importer)</th>
                    <th className="px-4 py-2 font-medium">Sản phẩm Trader</th>
                    <th className="px-4 py-2 font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMappings.map((mapping) => {
                    const importer = products.find((p) => p.productId === mapping.productId);
                    const trader = traderProducts.find((tp) => tp.traderProductId === mapping.traderProductId);
                    return (
                      <tr key={mapping.mappingId} className="hover:bg-gray-50 border-t">
                        <td className="px-4 py-2">{mapping.mappingId}</td>
                        <td className="px-4 py-2">{importer?.productName || "N/A"}</td>
                        <td className="px-4 py-2">{trader?.productName || "N/A"}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleDelete(mapping.mappingId)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            🗑️ Xoá
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

TraderProductMapping.propTypes = {
  traderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default TraderProductMapping;
