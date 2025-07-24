import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AllProductsLayout from '../../layouts/AllProductsLayout';
import './AllProducts.css';
import ProductSlider from '../HomePage/ProductSlider'; // đổi đường dẫn nếu khác
import { toast } from 'react-toastify';
import * as bootstrap from 'bootstrap';
import { useNavigate } from 'react-router-dom';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [saveProduct, setSaveProduct] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cartQuantities, setCartQuantities] = useState({});
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId;
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [supplier, setSupplier] = useState(null);



    const handleAddToCart = async (product) => {
        if (!userId) {
            toast.error("Vui lòng đăng nhập");
            return;
        }

        try {
            const res = await axios.get(`http://localhost:8082/PureFoods/api/cart/user/${userId}`);
            const cartItems = res.data;
            const existingItem = cartItems.find(item => item.productID === product.productId);
            const currentQty = existingItem ? existingItem.quantity : 0;
            const newQty = currentQty + 1;

            if (newQty > product.stockQuantity) {
                toast.warning(`Chỉ còn ${product.stockQuantity - currentQty} sản phẩm trong kho`);
                return;
            }

            const cartItem = {
                userID: userId,
                productID: product.productId,
                quantity: newQty,
                priceAfterDiscount: product.salePrice,
                total: product.salePrice * newQty,
                imageURL: product.imageURL,
                productName: product.productName,
                originalPrice: product.price,
                discount: product.discountPercent,
            };

            if (existingItem) {
                await axios.put(`http://localhost:8082/PureFoods/api/cart/update/${existingItem.cartItemID}`, cartItem);
            } else {
                await axios.post("http://localhost:8082/PureFoods/api/cart/create", cartItem);
            }

            setCartQuantities(prev => ({ ...prev, [product.productId]: newQty }));
            toast.success("Đã thêm vào giỏ hàng");
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (err) {
            toast.error("Thêm vào giỏ hàng thất bại");
            console.error(err);
        }
    };


    const handleViewDetail = (productId) => {
        const modalEl = document.getElementById("view");
        if (modalEl && bootstrap.Modal.getInstance(modalEl)) {
            bootstrap.Modal.getInstance(modalEl).hide();
        }

        navigate(`/product/${productId}`);
    };


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


    const handleViewProduct = async (product) => {
        setSelectedProduct(product);

        try {
            const resCategory = await axios.get(`http://localhost:8082/PureFoods/api/category/${product.categoryId}`);
            const resSupplier = await axios.get(`http://localhost:8082/PureFoods/api/supplier/${product.supplierId}`);
            setCategory(resCategory.data);
            setSupplier(resSupplier.data);
        } catch (error) {
            console.error("Lỗi khi tải danh mục hoặc nhà cung cấp:", error);
        }

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
            <div className="modal fade theme-modal view-modal" id="view" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-xl modal-fullscreen-sm-down">
                    <div className="modal-content">
                        <div className="modal-header p-0">
                            <button type="button" className="btn-close" data-bs-dismiss="modal">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row g-sm-4 g-2">
                                <div className="col-lg-6">
                                    <div className="slider-image">
                                        <img src={selectedProduct?.imageURL} className="img-fluid blur-up lazyload" alt="" />
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="right-sidebar-modal">
                                        <h4 className="title-name">{selectedProduct?.productName}</h4>
                                        <h4 className="price theme-color ">
                                            ${selectedProduct?.salePrice?.toFixed(2)}{" "}
                                            <del className="text-muted ">${selectedProduct?.price}</del>
                                        </h4>

                                        <div className="product-rating">
                                            <ul className="rating">
                                                <li>
                                                    <i data-feather="star" className="fill"></i>
                                                </li>
                                                <li>
                                                    <i data-feather="star" className="fill"></i>
                                                </li>
                                                <li>
                                                    <i data-feather="star" className="fill"></i>
                                                </li>
                                                <li>
                                                    <i data-feather="star" className="fill"></i>
                                                </li>
                                                <li>
                                                    <i data-feather="star"></i>
                                                </li>
                                            </ul>
                                            <span className="ms-2">8 Reviews</span>
                                            <span className="ms-2 text-danger">6 sold in last 16 hours</span>
                                        </div>

                                        <div className="product-detail">
                                            <p>{selectedProduct?.description || "No description available."}</p>
                                        </div>

                                        <ul className="brand-list">
                                            <li>
                                                <div className="brand-box">
                                                    <h5>Category Name:</h5>
                                                    <h6 className="mb-3">{category?.categoryName || "Đang tải..."}</h6>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="brand-box">
                                                    <h5>Supplier Name:</h5>
                                                    <h6 className="mb-3">{supplier?.supplierName || "Đang tải..."}</h6>
                                                </div>
                                            </li>
                                        </ul>

                                        <ul className="brand-list">
                                            <li>
                                                <div className="brand-box">
                                                    <h5>Stock Quantity:</h5>
                                                    <h6 className="mb-3">{selectedProduct?.stockQuantity || "Đang tải..."}</h6>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="brand-box">
                                                    <h5>Supplier Name:</h5>
                                                    <h6 className="mb-3">{supplier?.supplierName || "Đang tải..."}</h6>
                                                </div>
                                            </li>
                                        </ul>


                                        <div className="modal-button">
                                            <button
                                                type="button"
                                                className="btn btn-md bg-dark cart-button text-white w-100"
                                                onClick={() => handleAddToCart(selectedProduct)}
                                            >
                                                Add To Cart
                                            </button>
                                            <button
                                                type="button"
                                                className="btn theme-bg-color view-button icon text-white fw-bold btn-md"
                                                onClick={() => handleViewDetail(selectedProduct.productId)}
                                            >
                                                View More Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </AllProductsLayout>
    );
};

export default AllProducts;
