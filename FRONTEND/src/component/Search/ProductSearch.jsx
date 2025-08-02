import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import HomepageLayout from '../../layouts/HomepageLayout';
import ProductSlider from '../HomePage/ProductSlider';
import './ProductSearch.css';

const ProductSearch = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userId, setUserId] = useState(null);

  const fetchCategories = () => {
    axios.get("http://localhost:8082/PureFoods/api/category/getAll")
      .then(res => {
        const list = res.data.listCategory || res.data;
        setCategories(list);
      })
      .catch(err => console.error(err));
  };

  const fetchProducts = async (term = '', categoryId = '') => {
    try {
      let url;
      let res;
      if (!term && !categoryId) {
        // Lấy tất cả sản phẩm nếu không có từ khóa và danh mục
        url = `http://localhost:8082/PureFoods/api/product/getAll`;
        res = await axios.get(url);
        let allProducts = res.data.listProduct;
        const productsWithCategory = allProducts.map(product => ({
          ...product,
          salePrice: product.discountPercent
            ? product.price * (1 - product.discountPercent / 100)
            : product.price,
          categoryName: categories.find(cat => cat.categoryID === product.categoryId)?.categoryName || "Không rõ",
        }));
        setProducts(productsWithCategory);
      } else {
        // Tìm kiếm với từ khóa/danh mục nếu có
        url = `http://localhost:8082/PureFoods/api/product/search?q=${encodeURIComponent(term)}` +
          `${categoryId ? `&categoryId=${categoryId}` : ''}&page=0&size=1000`;
        res = await axios.get(url);
        if (res.data.status === 200) {
          let searchedProducts = res.data.products;
          // Lọc thêm theo tên sản phẩm chứa term (case-insensitive)
          if (term) {
            searchedProducts = searchedProducts.filter(product => 
              product.productName.toLowerCase().includes(term.toLowerCase())
            );
          }
          const productsWithCategory = searchedProducts.map(product => ({
            ...product,
            salePrice: product.discountPercent
              ? product.price * (1 - product.discountPercent / 100)
              : product.price,
            categoryName: categories.find(cat => cat.categoryID === product.categoryId)?.categoryName || "Không rõ",
          }));
          setProducts(productsWithCategory);
        } else {
          toast.error("Không thể tìm kiếm sản phẩm");
          setProducts([]);
        }
      }
    } catch (err) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", err);
      toast.error("Không thể tìm kiếm sản phẩm");
      setProducts([]);
    }
  };

  const handleViewProduct = (product) => {
    window.location.href = `/product/${product.productId}`;
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(searchTerm, selectedCategory);
  }, [categories, searchTerm, selectedCategory]);

  const handleSearch = () => {
    fetchProducts(searchTerm, selectedCategory);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  useEffect(() => {
    setUserId(1); // Thay bằng logic lấy userId thực tế
  }, []);

  return (
    <HomepageLayout>
      <section className="section-b-space search-section">
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-12">
              <div className="title section-t-space">
                <h2>Kết quả tìm kiếm</h2>
                <p>
                  Kết quả cho: "<strong>{searchTerm || "Tất cả sản phẩm"}</strong>"
                  {selectedCategory ? ` trong danh mục ${categories.find(cat => cat.categoryID === parseInt(selectedCategory))?.categoryName || ""}` : ""}
                </p>
              </div>
              <div className="d-flex align-items-center mb-3" style={{ maxWidth: "600px", width: "100%" }}>
                <div className="input-group me-2 flex-grow-1">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm sản phẩm..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <button className="btn btn-primary" onClick={handleSearch}>
                    <i className="fa fa-search"></i>
                  </button>
                </div>
                <select className="form-select" value={selectedCategory} onChange={handleCategoryChange}>
                  <option value="">Tất cả danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.categoryID} value={cat.categoryID}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              {products.length > 0 ? (
                <ProductSlider
                  products={products}
                  handleViewProduct={handleViewProduct}
                  userId={userId}
                />
              ) : (
                <div className="text-center">Không tìm thấy sản phẩm nào.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </HomepageLayout>
  );
};

export default ProductSearch;