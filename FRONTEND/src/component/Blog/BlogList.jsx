import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import HomepageLayout from '../../layouts/HomepageLayout';
import feather from 'feather-icons';
import CartLayout from "../../layouts/CartLayout";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBlogs = blogs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(blogs.length / itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch blogs
        const blogRes = await axios.get('http://localhost:8082/PureFoods/api/blog/getAll');
        setBlogs(blogRes.data.blogList || []);

        // Fetch trending products
        const productRes = await axios.get('http://localhost:8082/PureFoods/api/product/top-discount');
        setProducts(productRes.data || []);

        // Fetch categories
        const categoryRes = await axios.get('http://localhost:8082/PureFoods/api/category/getAll');
        setCategories(categoryRes.data || []);
      } catch (err) {
        toast.error('Không thể tải dữ liệu!');
        console.error('Fetch error:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    feather.replace();
  }, [blogs, products, categories]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <HomepageLayout>
      <section className="section-b-space blog-section">
        <div className="container-fluid-lg">
          <div className="row g-4">
            <div className="col-lg-9">
              <div className="title section-t-space">
                <h2>Blog Nổi Bật</h2>
                <span className="title-leaf">
                  <svg className="icon-width">
                    <use href="../assets/svg/leaf.svg#leaf" />
                  </svg>
                </span>
                <p>Khám phá các bài viết hữu ích về thực phẩm sạch và lối sống lành mạnh</p>
              </div>

              <div className="row g-4">
                {currentBlogs.map((blog, index) => (
                  <div className="col-lg-6 col-md-6" key={index}>
                    <div className="blog-box">
                      <div className="blog-box-image">
                        <Link to={`/blog-detail/${blog.blogID}`} className="blog-image">
                          <img
                            src={`../assets/images/vegetable/blog/${(index % 3) + 1}.jpg`}
                            className="bg-img blur-up lazyload"
                            alt={blog.title}
                          />
                        </Link>
                      </div>
                      <div className="blog-detail">
                        <h6>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</h6>
                        <Link to={`/blog-detail/${blog.blogID}`}>
                          <h5>{blog.title}</h5>
                        </Link>
                        <p className="text-content">
                          {blog.content.length > 150 ? `${blog.content.substring(0, 150)}...` : blog.content}
                        </p>
                        <Link to={`/blog-detail/${blog.blogID}`} className="btn btn-sm btn-animation">
                          Đọc thêm <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pagination-container d-flex justify-content-center mt-4">
                <nav>
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Trước
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                      <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Sau
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="category-menu">
                <h3>Bài viết gần đây</h3>
                <ul>
                  {blogs.slice(0, 4).map((blog, index) => (
                    <li key={index}>
                      <div className="offer-product">
                        <Link to={`/blog-detail/${blog.blogID}`} className="offer-image">
                          <img
                            src={`../assets/images/vegetable/blog/${(index % 3) + 1}.jpg`}
                            className="blur-up lazyload"
                            alt={blog.title}
                          />
                        </Link>
                        <div className="offer-detail">
                          <Link to={`/blog-detail/${blog.blogID}`}>
                            <h6 className="name">{blog.title.substring(0, 50)}...</h6>
                          </Link>
                          <span>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="category-menu section-t-space">
                <h3>Danh mục</h3>
                <ul>
                  {categories.map((category, index) => (
                    <li key={index}>
                      <Link to={`/category?cate=${category.categoryID}`}>
                        {category.categoryName} <span>({Math.floor(Math.random() * 10) + 5})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="category-menu section-t-space">
                <h3>Thẻ bài viết</h3>
                <ul className="tag-cloud">
                  <li><Link to="/blog-list">Thực phẩm hữu cơ</Link></li>
                  <li><Link to="/blog-list">Rau củ</Link></li>
                  <li><Link to="/blog-list">Dinh dưỡng</Link></li>
                  <li><Link to="/blog-list">Sống khỏe</Link></li>
                  <li><Link to="/blog-list">Ẩm thực</Link></li>
                  <li><Link to="/blog-list">Món chay</Link></li>
                </ul>
              </div>

              <div className="category-menu section-t-space">
                <h3>Sản phẩm thịnh hành</h3>
                <ul className="product-list">
                  {products.slice(0, 3).map((product, index) => (
                    <li key={index}>
                      <div className="offer-product">
                        <Link to={`/product/${product.productId}`} className="offer-image">
                          <img
                            src={product.imageURL}
                            className="blur-up lazyload"
                            alt={product.productName}
                          />
                        </Link>
                        <div className="offer-detail">
                          <Link to={`/product/${product.productId}`}>
                            <h6 className="name">{product.productName}</h6>
                          </Link>
                          <h6 className="price theme-color">
                            ${product.salePrice} <del>${product.price}</del>
                          </h6>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HomepageLayout>
  );
};

export default BlogList;
