import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import './CustomerBlog.css';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8082/PureFoods/api/blog/${id}`)
      .then(res => setBlog(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!blog) return <div>Loading...</div>;

  return (
    <div className="blog-container">
      <Header />
      <div className="container">
        <div className="blog-card">
          <h2 className="blog-title">{blog.title}</h2>
          <p className="blog-meta">Posted on: {new Date(blog.createdAt).toLocaleDateString()}</p>
          <p className="blog-content">{blog.content}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default BlogDetail;
