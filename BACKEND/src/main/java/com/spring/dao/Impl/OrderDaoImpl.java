package com.spring.dao.Impl;

import com.spring.dao.OrderDAO;
import com.spring.entity.Orders;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public class OrderDaoImpl implements OrderDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Orders> getAllOrders() {
        Query query = entityManager.createQuery("SELECT o FROM Orders o");
        return query.getResultList();
    }

    @Override
    public Orders getOrderById(int id) {
        return entityManager.find(Orders.class, id);
    }

    @Override
    public Orders addOrder(Orders order) {
        entityManager.persist(order);
        return order;
    }

    @Override
    public Orders updateOrder(Orders order) {
        return entityManager.merge(order);
    }

    @Override
    public void deleteOrder(int id) {
        Orders order = entityManager.find(Orders.class, id);
        if (order != null) {
            entityManager.remove(order);
        }
    }

    @Override
    public List<Orders> getOrdersBySellerId(int sellerId) {
        Query query = entityManager.createQuery("SELECT o FROM Orders o WHERE o.seller.userId = :sellerId");
        query.setParameter("sellerId", sellerId);
        return query.getResultList();
    }

    @Override
    public long countOrders() {
        Query query = entityManager.createQuery("SELECT COUNT(o) FROM Orders o");
        return (long) query.getSingleResult();
    }
}
