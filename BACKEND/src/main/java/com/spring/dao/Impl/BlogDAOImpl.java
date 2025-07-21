package com.spring.dao.Impl;

import com.spring.dao.BlogDAO;
import com.spring.entity.Blog;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class BlogDAOImpl implements BlogDAO {
    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public Blog getBlogById(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(Blog.class, id);
    }

    @Override
    public List<Blog> getAllBlogs() {
        Session session = sessionFactory.getCurrentSession();
        Query<Blog> query = session.createQuery("FROM Blog", Blog.class);
        return query.getResultList();
    }

    @Override
    public Blog createBlog(Blog blog) {
        Session session = sessionFactory.getCurrentSession();
        session.save(blog);
        return blog;
    }

    @Override
    public Blog updateBlog(Blog blog) {
        Session session = sessionFactory.getCurrentSession();
        session.update(blog);
        return blog;
    }

    @Override
    public void deleteBlog(int id) {
        Session session = sessionFactory.getCurrentSession();
        Blog blog = session.get(Blog.class, id);
        if (blog != null) {
            session.delete(blog);
        }
    }
}
