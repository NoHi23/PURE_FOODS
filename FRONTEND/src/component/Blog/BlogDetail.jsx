import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import HomepageLayout from '../../layouts/HomepageLayout';
import feather from 'feather-icons';

const BlogDetail = () => {
  const { blogID } = useParams();
  const [blog, setBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: '', email: '', website: '', content: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch blog detail
        const blogRes = await axios.get(`http://localhost:8082/PureFoods/api/blog/getById/${blogID}`);
        setBlog(blogRes.data.blog || null);

        // Fetch recent blogs
        const recentBlogsRes = await axios.get('http://localhost:8082/PureFoods/api/blog/getAll');
        setBlogs(recentBlogsRes.data.blogList || []);

        // Fetch trending products
        const productRes = await axios.get('http://localhost:8082/PureFoods/api/product/top-discount');
        setProducts(productRes.data || []);

        // Fetch categories
        const categoryRes = await axios.get('http://localhost:8082/PureFoods/api/category/getAll');
        setCategories(categoryRes.data || []);

        // Mock comments (có thể thay bằng API thực nếu có)
        setComments([
          { id: 1, name: 'Glenn Greer', date: '30 Jan, 2022', content: 'This proposal is a win-win situation which will cause a stellar paradigm shift...' },
          { id: 2, name: 'Glenn Greer', date: '30 Jan, 2022', content: 'Yeah, I think maybe you do. Right, gimme a Pepsi free...' },
          { id: 3, name: 'Glenn Greer', date: '30 Jan, 2022', content: 'Cheese slices goat cottage cheese roquefort cream cheese...' },
        ]);
      } catch (err) {
        toast.error('Không thể tải dữ liệu!');
        console.error('Fetch error:', err);
      }
    };
    fetchData();
  }, [blogID]);

  useEffect(() => {
    feather.replace();
  }, [blog, blogs, products, categories]);

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.name || !newComment.email || !newComment.content) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    // Mock thêm bình luận (thay bằng API thực nếu có)
    setComments([...comments, {
      id: comments.length + 1,
      name: newComment.name,
      date: new Date().toLocaleDateString('vi-VN'),
      content: newComment.content,
    }]);
    setNewComment({ name: '', email: '', website: '', content: '' });
    toast.success('Bình luận đã được gửi!');
  };

  return (
    <HomepageLayout>
      <section className="section-b-space blog-section">
        <div className="container-fluid-lg">
          <div className="row g-4">
            <div className="col-lg-9">
              <div className="title section-t-space">
                <h2>{blog ? blog.title : 'Đang tải...'}</h2>
                <span className="title-leaf">
                  <svg className="icon-width">
                    <use href="../assets/svg/leaf.svg#leaf" />
                  </svg>
                </span>
                <div className="blog-meta d-flex gap-2">
                  <span>{blog ? new Date(blog.createdAt).toLocaleDateString('vi-VN') : ''}</span>
                  <span>{blog ? `Tác giả: ${blog.userID}` : ''}</span>
                  <span>{comments.length} Bình luận</span>
                </div>
              </div>
              <div className="blog-content">
                <img
                  src={blog ? `../assets/images/vegetable/blog/1.jpg` : '../assets/images/vegetable/blog/placeholder.jpg'}
                  className="img-fluid blur-up lazyload mb-3"
                  alt={blog ? blog.title : 'Blog'}
                />
                <p>{blog ? blog.content : 'Đang tải nội dung...'}</p>
              </div>
              <div className="blog-tags mt-3">
                <h5>Tags:</h5>
                <ul className="tag-cloud">
                  <li><Link to="/blog-list">Thực phẩm hữu cơ</Link></li>
                  <li><Link to="/blog-list">Rau củ</Link></li>
                  <li><Link to="/blog-list">Dinh dưỡng</Link></li>
                </ul>
              </div>
              <div className="blog-comments mt-4">
                <h3>Bình luận ({comments.length})</h3>
                {comments.map((comment) => (
                  <div className="comment-box mt-3" key={comment.id}>
                    <div className="d-flex justify-content-between">
                      <h6>{comment.name}</h6>
                      <button className="btn btn-sm btn-outline">Trả lời</button>
                    </div>
                    <span>{comment.date}</span>
                    <p>{comment.content}</p>
                  </div>
                ))}
              </div>
              <div className="leave-comment mt-4">
                <h3>Để lại bình luận</h3>
                <p>Địa chỉ email của bạn sẽ không được công bố. Các trường bắt buộc được đánh dấu *</p>
                <form onSubmit={handleCommentSubmit}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={newComment.name}
                        onChange={handleCommentChange}
                        placeholder="Tên *"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={newComment.email}
                        onChange={handleCommentChange}
                        placeholder="Email *"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="url"
                        className="form-control"
                        name="website"
                        value={newComment.website}
                        onChange={handleCommentChange}
                        placeholder="Website"
                      />
                    </div>
                    <div className="col-12">
                      <textarea
                        className="form-control"
                        name="content"
                        value={newComment.content}
                        onChange={handleCommentChange}
                        placeholder="Bình luận *"
                        rows="5"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="saveInfo"
                        />
                        <label className="form-check-label" htmlFor="saveInfo">
                          Lưu tên, email và website của tôi trong trình duyệt này cho lần bình luận tiếp theo.
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-animation btn-md">
                        Gửi bình luận
                      </button>
                    </div>
                  </div>
                </form>
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

export default BlogDetail;