import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AllProductsLayout from '../../layouts/AllProductsLayout';
import './AllProducts.css';
import ProductSlider from '../HomePage/ProductSlider'; // đổi đường dẫn nếu khác
import { toast } from 'react-toastify';
import * as bootstrap from 'bootstrap';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [saveProduct, setSaveProduct] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId;

    useEffect(() => {
        if (!selectedCategory && !selectedSupplier) {
            axios
                .get('http://localhost:8082/PureFoods/api/product/getAll/status0')
                .then((res) => {
                    setProducts(res.data.listProduct || []);
                })
                .catch((err) => {
                    console.error('Error fetching products:', err);
                });
        } else {
            fetchProducts();
        }
        fetchCategories();
        fetchSuppliers();
    }, [selectedCategory, selectedSupplier]);

    const fetchProducts = () => {
        axios
            .get('http://localhost:8082/PureFoods/api/product/search', {
                params: {
                    categoryID: selectedCategory || undefined,
                    supplierId: selectedSupplier || undefined,
                },
            })
            .then((res) => {
                setProducts(res.data.products || []);
            })
            .catch((err) => {
                console.error('Error fetching products:', err);
            });
    };

    const fetchCategories = () => {
        axios
            .get('http://localhost:8082/PureFoods/api/category/getAll')
            .then((res) => {
                setCategories(res.data || []);
            })
            .catch((err) => {
                console.error('Error fetching categories:', err);
            });
    };

    const fetchSuppliers = () => {
        axios
            .get('http://localhost:8082/PureFoods/api/supplier/getAll')
            .then((res) => {
                setSuppliers(res.data.suppliers || []);
            })
            .catch((err) => {
                console.error('Error fetching suppliers:', err);
            });
    };


    const handleViewProduct = (product) => {
        setSelectedProduct(product);

        const modalElement = document.getElementById('view');
        if (!modalElement) {
            console.error("Modal with id 'view' not found in DOM");
            return;
        }

        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    };


    return (
        <AllProductsLayout>
            <section className="section-b-space shop-section">
                <div className="container-fluid-lg">
                    <div className="row g-sm-4 g-3">
                        <div className="col-xxl-3 col-lg-4">
                            <div className="filter-section">
                                <h5>Filter by Category</h5>
                                <select
                                    className="form-select"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.categoryID} value={cat.categoryID}>
                                            {cat.categoryName}
                                        </option>
                                    ))}
                                </select>

                                <h5 className="mt-3">Filter by Supplier</h5>
                                <select
                                    className="form-select"
                                    value={selectedSupplier}
                                    onChange={(e) => setSelectedSupplier(e.target.value)}
                                >
                                    <option value="">All Suppliers</option>
                                    {suppliers.map((sup) => (
                                        <option key={sup.supplierId} value={sup.supplierId}>
                                            {sup.supplierName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="col-xxl-9 col-lg-8">
                            {products.length === 0 ? (
                                <div className="col-12">
                                    <h4>No products found.</h4>
                                </div>
                            ) : (
                                <div className="section-b-space w-100">
                                    <ProductSlider
                                        products={products}
                                        handleViewProduct={handleViewProduct}
                                        userId={userId}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Product View Modal */}
            <div
                className="modal fade"
                id="view"
                tabIndex="-1"
                aria-labelledby="productModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="productModalLabel">
                                {selectedProduct?.productName}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            {selectedProduct ? (
                                <div className="row">
                                    <div className="col-md-6">
                                        <img
                                            src={selectedProduct.imageUrl}
                                            alt={selectedProduct.productName}
                                            className="img-fluid"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <p><strong>Giá:</strong> {selectedProduct.price.toLocaleString()}$</p>
                                        <p><strong>Giảm giá:</strong> {selectedProduct.discountPercent}%</p>
                                        <p><strong>Tồn kho:</strong> {selectedProduct.stockQuantity}</p>
                                        {/* Thêm thông tin khác nếu cần */}
                                    </div>
                                </div>
                            ) : (
                                <p>Đang tải sản phẩm...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </AllProductsLayout>
    );
};

export default AllProducts;
