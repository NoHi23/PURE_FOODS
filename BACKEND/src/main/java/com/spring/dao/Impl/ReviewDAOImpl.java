package com.spring.dao.Impl;

import com.spring.dao.ReviewDAO;
import com.spring.entity.Review;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ReviewDAOImpl implements ReviewDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public boolean existsByProductIdAndCustomerId(int productId, int customerId) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "SELECT COUNT(r) FROM Review r WHERE r.product.productId = :productId AND r.customer.userId = :customerId";
        Long count = session.createQuery(hql, Long.class)
                .setParameter("productId", productId)
                .setParameter("customerId", customerId)
                .uniqueResult();
        return count != null && count > 0;
    }

    @Override
    public Review findByProductAndCustomer(int productId, int customerId) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "FROM Review r WHERE r.product.productId = :productId AND r.customer.userId = :customerId";
        Query<Review> query = session.createQuery(hql, Review.class)
                .setParameter("productId", productId)
                .setParameter("customerId", customerId);
        return query.uniqueResult();
    }

    @Override
    public Review saveReview(Review review) {
        Session session = sessionFactory.getCurrentSession();
        if (review.getReviewId() == 0) {
            session.save(review);
        } else {
            session.update(review);
        }
        return review;
    }

    @Override
    public void deleteByProductAndCustomer(int productId, int customerId) {
        Review review = findByProductAndCustomer(productId, customerId);
        if (review != null) {
            Session session = sessionFactory.getCurrentSession();
            session.delete(review);
        }
    }

    @Override
    public List<Review> findByProductIdAndStatus(int productId, int status) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "FROM Review r WHERE r.product.productId = :productId AND r.status = :status ORDER BY r.createdAt DESC";
        Query<Review> query = session.createQuery(hql, Review.class)
                .setParameter("productId", productId)
                .setParameter("status", status);
        return query.getResultList();
    }
    @Override
    public List<Review> findAll() {
        return sessionFactory.getCurrentSession()
                .createQuery("FROM Review", Review.class)
                .getResultList();
    }

    @Override
    public Review findById(int id) {
        return sessionFactory.getCurrentSession().get(Review.class, id);
    }
    @Override
    public void deleteById(int id) {
        Session session = sessionFactory.getCurrentSession();
        Review review = session.get(Review.class, id);
        if (review != null) {
            session.delete(review);
        }
    }
    @Override
    public Double getAverageRatingByProductId(int productId) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "SELECT AVG(r.rating) FROM Review r WHERE r.product.productId = :productId AND r.status = 1";
        return session.createQuery(hql, Double.class)
                .setParameter("productId", productId)
                .uniqueResult();
    }

    @Override
    public List<Object[]> getAverageRatingsForAllProducts() {
        Session session = sessionFactory.getCurrentSession();
        String hql = "SELECT r.product.productId, r.product.productName, AVG(r.rating) " +
                "FROM Review r WHERE r.status = 1 GROUP BY r.product.productId, r.product.productName";
        return session.createQuery(hql).list();
    }
    @Override
    public List<Object[]> findAverageRatingByProduct() {
        Session session = sessionFactory.getCurrentSession();
        String hql = "SELECT r.product.productId, r.product.productName, AVG(r.rating) " +
                "FROM Review r WHERE r.status = 1 GROUP BY r.product.productId, r.product.productName";
        return session.createQuery(hql, Object[].class).getResultList();
    }
    @Override
    public List<Review> findByStatus(int status) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "FROM Review r WHERE r.status = :status ORDER BY r.createdAt DESC";
        return session.createQuery(hql, Review.class)
                .setParameter("status", status)
                .getResultList();
    }


}
