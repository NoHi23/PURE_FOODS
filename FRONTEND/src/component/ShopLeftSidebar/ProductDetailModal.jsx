import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

const ProductDetailModal = ({ show, onHide, product }) => {
  const [categoryList, setCategoryList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);

  useEffect(() => {
    if (!show || !product) return;

    const fetchMetaData = async () => {
      try {
        const [categoryRes, supplierRes] = await Promise.all([
          axios.get("http://localhost:8082/PureFoods/api/category/getAll"),
          axios.get("http://localhost:8082/PureFoods/api/supplier/getAll"),
        ]);
        setCategoryList(categoryRes.data || []);
        setSupplierList(supplierRes.data.suppliers || []);
      } catch (err) {
        console.error("Lỗi khi fetch danh mục hoặc nhà cung cấp:", err);
      }
    };

    fetchMetaData();
  }, [show, product]);

  if (!product) return null;

  const categoryName =
    categoryList.find((c) => c.categoryID === product.categoryId)?.categoryName || `#${product.categoryId}`;
  const supplierName =
    supplierList.find((s) => s.supplierId === product.supplierId)?.supplierName || `#${product.supplierId}`;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{product.productName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img
          src={product.imageURL}
          alt={product.productName}
          style={{ maxHeight: "250px", objectFit: "contain", marginBottom: "15px" }}
          className="img-fluid d-block mx-auto"
        />
        <p>
          <strong>Mô tả:</strong> {product.description}
        </p>
        <p>
          <strong>Giá:</strong> ${product.salePrice} <del>${product.price}</del>
        </p>
        <p>
          <strong>Số lượng:</strong> {product.stockQuantity}
        </p>
        <p>
          <strong>Thể loại:</strong> {categoryName}
        </p>
        <p>
          <strong>Nhà cung cấp:</strong> {supplierName}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductDetailModal;
