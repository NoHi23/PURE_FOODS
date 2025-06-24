package com.spring.dao.Impl;

import com.spring.dao.OrderDetailsDAO;
import com.spring.entity.OrderDetails;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class OrderDetailsDaoImpl implements OrderDetailsDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<OrderDetails> getAllOrderDetails() {
        Query query = entityManager.createQuery("SELECT od FROM OrderDetails od");
        return query.getResultList();
    }

    @Override
    public OrderDetails getOrderDetailById(int id) {
        return entityManager.find(OrderDetails.class, id);
    }

    @Override
    public OrderDetails addOrderDetail(OrderDetails orderDetail) {
        entityManager.persist(orderDetail);
        return orderDetail;
    }

    @Override
    public OrderDetails updateOrderDetail(OrderDetails orderDetail) {
        return entityManager.merge(orderDetail);
    }

    @Override
    public void deleteOrderDetail(int id) {
        OrderDetails orderDetail = entityManager.find(OrderDetails.class, id);
        if (orderDetail != null) {
            entityManager.remove(orderDetail);
        }
    }

    @Override
    public List<OrderDetails> getOrderDetailsByOrderId(int orderId) {
        Query query = entityManager.createQuery("SELECT od FROM OrderDetails od WHERE od.order.orderId = :orderId");
        query.setParameter("orderId", orderId);
        return query.getResultList();
    }

    @Override
    public long countOrderDetails() {
        Query query = entityManager.createQuery("SELECT COUNT(od) FROM OrderDetails od");
        return (long) query.getSingleResult();
    }
}
