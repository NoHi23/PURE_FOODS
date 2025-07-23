package com.spring.dao.Impl;


import com.spring.dao.OrderDetailDAO;
import com.spring.entity.OrderDetail;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public class OrderDetailDAOImpl implements OrderDetailDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public OrderDetail save(OrderDetail orderDetail) {
        entityManager.persist(orderDetail);
        return orderDetail;
    }

    @Override
    public List<OrderDetail> findByOrderID(int orderId) {
        String jpql = "SELECT od FROM OrderDetail od WHERE od.orderID = :orderId";
        return entityManager.createQuery(jpql, OrderDetail.class)
                .setParameter("orderId", orderId)
                .getResultList();
    }
}
