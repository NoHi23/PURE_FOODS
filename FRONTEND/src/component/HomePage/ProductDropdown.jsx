import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
//import "./ProductDropdown.css";

const ProductDropdown = () => {
    const [categories, setCategories] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState({});

    useEffect(() => {
        const handleCategoryUpdated = () => {
            fetchCategories();
        };

        window.addEventListener('categoryUpdated', handleCategoryUpdated);

        fetchCategories(); // lần đầu

        return () => window.removeEventListener('categoryUpdated', handleCategoryUpdated);
    }, []);

    const fetchCategories = async () => {
        try {
            setCategoryProducts({}); // 👉 reset trước khi load lại
            const res = await axios.get("http://localhost:8082/PureFoods/api/category/getAll");
            const cats = res.data || [];
            console.log("Fetched categories:", cats);
            setCategories(cats);

            for (const cat of cats) {
                try {
                    const productRes = await axios.get("http://localhost:8082/PureFoods/api/product/search", {
                        params: { categoryId: cat.categoryID }
                    });
                    const products = productRes.data.products || [];

                    setCategoryProducts(prev => ({
                        ...prev,
                        [cat.categoryID]: products
                    }));
                } catch (err) {
                    console.error(`Error loading products for category ${cat.categoryName}:`, err);
                }
            }
        } catch (err) {
            console.error("Error loading categories:", err);
        }
    };


    return (
        <li className="nav-item dropdown dropdown-mega">
            <Link className="nav-link" to="/all-products">Sản phẩm</Link>
            <div className="dropdown-menu dropdown-menu-2">
                <div className="row">
                    {categories.slice(0, 10).map((cat) => (
                        <div className="dropdown-column col-xl-3" key={cat.categoryID}>
                            <h5 className="dropdown-header">{cat.categoryName}</h5>
                            {(categoryProducts[cat.categoryID] || []).slice(0, 10).length > 0 ? (
                                (categoryProducts[cat.categoryID] || []).slice(0, 10).map((product) => (
                                    <Link className="dropdown-item" to={`/product/${product.productId}`} key={product.productId}>
                                        {product.productName}
                                    </Link>
                                ))
                            ) : (
                                <span className="dropdown-item text-muted">Không có sản phẩm</span>
                            )}
                        </div>
                    ))}

                    {/* Optional: Hình ảnh hoặc nội dung trang trí */}
                    <div className="dropdown-column dropdown-column-img col-3 d-none d-xl-block">
                        {/* <img src="..." alt="banner" className="img-fluid" /> */}
                    </div>
                </div>
            </div>
        </li>
    );
};

export default ProductDropdown;
