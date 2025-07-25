package com.spring.dao.Impl;

import com.spring.dao.OrderStatusDAO;
import com.spring.entity.OrderStatus;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class OrderStatusDAOImpl implements OrderStatusDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public OrderStatus getOrderStatusById(int statusID) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(OrderStatus.class, statusID);
    }
}
