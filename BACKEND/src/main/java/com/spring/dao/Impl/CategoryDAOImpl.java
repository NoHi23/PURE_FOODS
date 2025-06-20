package com.spring.dao.Impl;

import com.spring.dao.CategoryDAO;
import com.spring.entity.Category;
import com.spring.entity.Products;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class CategoryDAOImpl implements CategoryDAO {
    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public Category getCategoryById(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(Category.class, id);
    }

    @Override
    public List<Category> getAllCategories() {
        Session session = sessionFactory.getCurrentSession();
        Query<Category> query = session.createQuery("FROM Category", Category.class);
        return query.getResultList();
    }

    @Override
    public Category createCategory(Category category) {
        Session session = sessionFactory.getCurrentSession();
        session.save(category);
        return category;
    }

    @Override
    public Category updateCategory(Category category) {
        Session session = sessionFactory.getCurrentSession();
        session.update(category);
        return category;
    }

    @Override
    public void deleteCategory(int id) {
        Session session = sessionFactory.getCurrentSession();
        Category category = session.get(Category.class, id);
        if (category != null) {
            session.delete(category);
        }
    }

}
