import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ProductDropdown.css";

const ProductDropdown = () => {
    const [categories, setCategories] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState({});

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get("http://localhost:8082/PureFoods/api/category/getAll");
            const cats = res.data || [];
            setCategories(cats);

            cats.forEach(async (cat) => {
                try {
                    const productRes = await axios.get("http://localhost:8082/PureFoods/api/product/search", {
                        params: { categoryId: cat.categoryID }
                    });
                    setCategoryProducts(prev => ({
                        ...prev,
                        [cat.categoryID]: productRes.data.products || []
                    }));
                } catch (err) {
                    console.error(`Error loading products for category ${cat.categoryName}:`, err);
                }
            });
        } catch (err) {
            console.error("Error loading categories:", err);
        }
    };

    return (
        <li className="nav-item dropdown dropdown-mega">
            <Link className="nav-link" to="/all-products">Product</Link>
            <div className="dropdown-menu dropdown-menu-2">
                <div className="row">
                    {categories.slice(0, 4).map((cat) => (
                        <div className="dropdown-column col-xl-3" key={cat.categoryID}>
                            <h5 className="dropdown-header">{cat.categoryName}</h5>
                            {(categoryProducts[cat.categoryID] || []).slice(0, 7).map((product) => (
                                <Link className="dropdown-item" to={`/product/${product.productId}`} key={product.productId}>
                                    {product.productName}
                                </Link>
                            ))}
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
