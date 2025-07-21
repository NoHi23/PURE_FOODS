import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AllProductsLayout from '../../layouts/AllProductsLayout';
import './AllProducts.css';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState('');

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
                console.log("CATEGORY DATA:", res.data); 
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
                console.log("SUPPLIER DATA:", res.data);
                setSuppliers(res.data.suppliers || []);
            })
            .catch((err) => {
                console.error('Error fetching suppliers:', err);
            });
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
                            <div className="row g-sm-4 g-3">
                                {products.length === 0 ? (
                                    <div className="col-12">
                                        <h4>No products found.</h4>
                                    </div>
                                ) : (
                                    products.map((product) => (
                                        <div className="col-xxl-3 col-lg-4 col-sm-6" key={product.productId}>
                                            <div className="product-box-3 h-100 wow fadeInUp">
                                                <div className="product-header">
                                                    <div className="product-image">
                                                        <img
                                                            src={product.imageUrl}
                                                            className="img-fluid"
                                                            alt={product.productName}
                                                        />
                                                        <ul className="product-option">
                                                            <li data-bs-toggle="tooltip" data-bs-placement="top" title="Add to Wishlist">
                                                                <a href="#" className="btn btn-sm">
                                                                    <i className="fa fa-heart"></i>
                                                                </a>
                                                            </li>
                                                            <li data-bs-toggle="tooltip" data-bs-placement="top" title="Quick View">
                                                                <a href="#" className="btn btn-sm">
                                                                    <i className="fa fa-eye"></i>
                                                                </a>
                                                            </li>
                                                            <li data-bs-toggle="tooltip" data-bs-placement="top" title="Add to Cart">
                                                                <a href="#" className="btn btn-sm">
                                                                    <i className="fa fa-shopping-cart"></i>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="product-footer">
                                                    <div className="product-detail">
                                                        <h5 className="name">{product.productName}</h5>
                                                        <h6 className="unit">Stock: {product.stockQuantity}</h6>
                                                        <h5 className="price">
                                                            {product.discountPercent > 0 ? (
                                                                <>
                                                                    <span className="theme-color">
                                                                        {(product.price * (1 - product.discountPercent / 100)).toLocaleString()}₫
                                                                    </span>
                                                                    <del>{product.price.toLocaleString()}₫</del>
                                                                </>
                                                            ) : (
                                                                <span className="theme-color">
                                                                    {product.price.toLocaleString()}₫
                                                                </span>
                                                            )}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AllProductsLayout>
    );
};

export default AllProducts;
