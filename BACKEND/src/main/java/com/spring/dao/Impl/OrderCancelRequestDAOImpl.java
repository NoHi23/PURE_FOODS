package com.spring.dao.Impl;

import com.spring.dao.OrderCancelRequestDAO;
import com.spring.entity.OrderCancelRequest;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class OrderCancelRequestDAOImpl implements OrderCancelRequestDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void save(OrderCancelRequest orderCancelRequest) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(orderCancelRequest);
    }

    @Override
    public OrderCancelRequest findByOrderId(int orderId) {
        Session session = sessionFactory.getCurrentSession();
        try {
            return session.createQuery("FROM OrderCancelRequest ocr WHERE ocr.orderID = :orderId", OrderCancelRequest.class)
                    .setParameter("orderId", orderId)
                    .getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public void update(OrderCancelRequest orderCancelRequest) {
        Session session = sessionFactory.getCurrentSession();
        session.update(orderCancelRequest);
    }
}