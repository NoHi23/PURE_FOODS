package com.spring.dao.Impl;

import com.spring.dao.ProductDAO;
import com.spring.entity.Products;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public class ProductDAOImpl implements ProductDAO {
    @Autowired
    private SessionFactory sessionFactory;
    @Override
    public List getAllProduct() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("from Products").list();
    }

    @Override
    public Products getProductById(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(Products.class, id);
    }

    @Override
    public Products addProduct(Products product) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(product);
        return product;
    }

    @Override
    public Products updateProduct(Products product) {
        Session session = sessionFactory.getCurrentSession();
        session.update(product);
        return product;
    }

    @Override
    public void deleteProduct(int id) {
        Session session = sessionFactory.getCurrentSession();
        Products product = session.get(Products.class, id);
        session.delete(product);
    }

    @Override
    public int countProduct() {
        Session session = sessionFactory.getCurrentSession();
        Query query = session.createQuery("select count(*) from Products");
        return ((Long) ((org.hibernate.query.Query<?>) query).uniqueResult()).intValue();
    }

}
