package com.spring.dao.Impl;

import com.spring.dao.ProductImageDAO;
import com.spring.entity.ProductImages;
import jakarta.transaction.Transactional;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public class ProductImageDAOImpl implements ProductImageDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void addImage(ProductImages image) {
        sessionFactory.getCurrentSession().save(image);
    }

    @Override
    public List<ProductImages> getImagesByProductId(int productId) {
        String hql = "FROM ProductImages WHERE productId = :ProductID AND status = 0";
        return sessionFactory.getCurrentSession()
                .createQuery(hql, ProductImages.class)
                .setParameter("ProductID", productId)
                .list();
    }

    @Override
    public void deleteImagesByProductId(int productId) {
        String hql = "UPDATE ProductImages SET status = 1 WHERE productId = :ProductID";
        sessionFactory.getCurrentSession()
                .createQuery(hql)
                .setParameter("ProductID", productId)
                .executeUpdate();
    }
}
