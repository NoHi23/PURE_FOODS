import React from "react";
import Pagination from "../../layouts/Pagination";

const ImporterInventoryLog = ({ products, currentPage, setCurrentPage }) => {
  const productsPerPage = 7;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);

  return (
    <div className="dashboard-order">
      <div className="title">
        <h2>Tất cả đơn hàng</h2>
        <span className="title-leaf title-leaf-gray">
          <svg className="icon-width bg-gray">
            <use href="../assets/svg/leaf.svg#leaf"></use>
          </svg>
        </span>
      </div>

      <div className="order-tab dashboard-bg-box">
        <div className="table-responsive">
          <table className="table order-table">
            <thead>
              <tr>
                <th scope="col">Mã đơn hàng</th>
                <th scope="col">Tên sản phẩm</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Giá</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, index) => (
                <tr key={index}>
                  <td className="product-image">#{product.productId || 100000 + index}</td>
                  <td>
                    <h6>{product.productName || "Tên SP"}</h6>
                  </td>
                  <td>
                    <label className={product.status === 1 ? "success" : "danger"}>
                      {product.status === 1 ? "Shipped" : "Pending"}
                    </label>
                  </td>
                  <td>
                    <h6>${product.price?.toFixed(2) || "0.00"}</h6>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ImporterInventoryLog;
