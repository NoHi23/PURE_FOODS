import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import './CustomerBlog.css';

const CustomerBlog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8082/PureFoods/api/blog/getAll")
      .then(res => {
        const list = res.data.listBlog || res.data;
        setBlogs(list.filter(blog => blog.status === 1)); // Only show active blogs
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="blog-container">
      <Header />
      <div className="container">
        <h2>Our Blog</h2>
        <div className="row">
          {blogs.map(blog => (
            <div className="col-md-4" key={blog.blogID}>
              <div className="blog-card">
                <h3 className="blog-title">{blog.title}</h3>
                <p className="blog-content">{blog.content.substring(0, 100)}...</p>
                <p className="blog-meta">Posted on: {new Date(blog.createdAt).toLocaleDateString()}</p>
                <Link to={`/blog/${blog.blogID}`} className="blog-link">Read More</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerBlog;
