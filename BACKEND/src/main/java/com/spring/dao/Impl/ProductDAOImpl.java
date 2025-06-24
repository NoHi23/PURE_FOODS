package com.spring.dao.Impl;

import com.spring.dao.ProductDAO;
import com.spring.entity.ProductDetails;
import com.spring.entity.Products;
import com.spring.entity.*;
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

    @Override
    public void addProductDetails(ProductDetails productDetails) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(productDetails);
    }

    @Override
    public void updateProductOrganicInfo(int productId, int organicStatusId) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "UPDATE ProductOrganicInfo SET organicStatusId = :organicStatusId WHERE productId = :productId";
        session.createQuery(hql)
                .setParameter("organicStatusId", organicStatusId)
                .setParameter("productId", productId)
                .executeUpdate();
    }

    @Override
    public ProductDetails getProductDetailsById(int productId) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(ProductDetails.class, productId);
    }
    public Products findById(int id) {
        return getProductById(id);
    }
    @Override
    public Products save(Products product) {
        Session session = sessionFactory.getCurrentSession();
        if (product.getProductId() == 0) {
            session.persist(product); // Thêm mới
        } else {
            session.merge(product); // Cập nhật
        }
        return product;
    }


}
