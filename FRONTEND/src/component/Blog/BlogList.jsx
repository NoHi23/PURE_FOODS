import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import BlogListLayout from '../../layouts/BlogListLayout'; // Updated import
import './BlogList.css';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const itemsPerPage = 6;

  const categories = [
    { name: 'Latest Recipes', count: 10 },
    { name: 'Diet Food', count: 6 },
    { name: 'Low Calorie Items', count: 8 },
    { name: 'Cooking Method', count: 9 },
    { name: 'Dairy Free', count: 12 },
    { name: 'Vegetarian Food', count: 10 },
  ];

  const tags = [
    'Fruit Cutting',
    'Meat',
    'Organic',
    'Cake',
    'Pick Fruit',
    'Bakery',
    'Organic Food',
    'Most Expensive Fruit',
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('http://localhost:8082/PureFoods/api/blog/getAll');
        setBlogs(res.data.blogList || []);
      } catch (err) {
        toast.error('Không thể tải danh sách bài viết!');
        console.error('Fetch error:', err);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = selectedCategory === 'All'
    ? blogs
    : blogs.filter(blog => blog.title.toLowerCase().includes(selectedCategory.toLowerCase()));

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBlogs = filteredBlogs.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <BlogListLayout>
      <div className="page-wrapper">
        <div className="breadcrumb-area">
          <div className="container">
            <ul className="breadcrumb">
              <li><Link to="/">Home</Link></li>
              <li>Blog List</li>
            </ul>
          </div>
        </div>

        <section className="blog-section section-b-space">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-9 order-lg-2">
                <div className="row g-4">
                  {currentBlogs.length === 0 ? (
                    <p>Không có bài viết nào để hiển thị.</p>
                  ) : (
                    currentBlogs.map((blog, index) => (
                      <div key={index} className="col-md-6">
                        <div className="blog-box">
                          <div className="blog-image">
                            <img
                              src={blog.image || '/assets/images/blog-placeholder.jpg'}
                              className="img-fluid"
                              alt={blog.title || 'Blog Image'}
                            />
                            {blog.popular && <span className="popular-badge">Popular</span>}
                          </div>
                          <div className="blog-content">
                            <ul className="blog-meta">
                              <li>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</li>
                              <li>{blog.author || 'Unknown Author'}</li>
                            </ul>
                            <h4>{blog.title || 'N/A'}</h4>
                            <p>{blog.content.substring(0, 150)}...</p>
                            <Link to={`/blog-detail/${blog.blogID}`} className="btn btn-outline">
                              Read More
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pagination-container d-flex justify-content-center mt-4">
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                          Previous
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
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>

              <div className="col-lg-3 order-lg-1">
                <div className="blog-sidebar">
                  <div className="sidebar-box recent-post">
                    <h4>Recent Post</h4>
                    <ul className="recent-post-list">
                      {blogs.slice(0, 4).map((blog, index) => (
                        <li key={index}>
                          <div className="recent-post-item">
                            <img
                              src={blog.image || '/assets/images/blog-placeholder.jpg'}
                              alt={blog.title || 'Blog Image'}
                              className="recent-post-img"
                            />
                            <div className="recent-post-content">
                              <Link to={`/blog-detail/${blog.blogID}`}>
                                {blog.title.substring(0, 50)}...
                              </Link>
                              <span>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="sidebar-box category-box">
                    <h4>Category</h4>
                    <ul className="category-list">
                      <li>
                        <a
                          href="#"
                          className={selectedCategory === 'All' ? 'active' : ''}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedCategory('All');
                            setCurrentPage(1);
                          }}
                        >
                          All
                        </a>
                      </li>
                      {categories.map((category, index) => (
                        <li key={index}>
                          <a
                            href="#"
                            className={selectedCategory === category.name ? 'active' : ''}
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedCategory(category.name);
                              setCurrentPage(1);
                            }}
                          >
                            {category.name} ({category.count})
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="sidebar-box tags-box">
                    <h4>Product Tags</h4>
                    <ul className="tags-list">
                      {tags.map((tag, index) => (
                        <li key={index}>
                          <a href="#" onClick={(e) => e.preventDefault()}>
                            {tag}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </BlogListLayout>
  );
};

export default BlogList;
