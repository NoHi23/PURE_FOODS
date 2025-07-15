package com.spring.dao.Impl;

import com.spring.dao.OrderDAO;
import com.spring.entity.Order;
import jakarta.persistence.NoResultException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class OrderDAOImpl implements OrderDAO {
    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public Order addOrder(Order order) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(order);
        session.flush();
        return order;
    }

    @Override
    public Order findOrderById(int id) {
        Session session = sessionFactory.getCurrentSession();
        Query<Order> query = session.createQuery("from Order where orderId = :id", Order.class);
        query.setParameter("id", id);
        return query.uniqueResult();
    }

    @Override
    public List<Order> getAllOrders() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("from Order").list();
    }

    @Override
    public Order getOrderById(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(Order.class, id);
    }

    @Override
    public Order updateOrder(Order order) {
        Session session = sessionFactory.getCurrentSession();
        session.update(order);
        return order;
    }

    @Override
    public void deleteOrder(int id) {
        Session session = sessionFactory.getCurrentSession();
        Order order = session.get(Order.class, id);
        session.delete(order);
    }

    @Override
    public int countOrders() {
        Session session = sessionFactory.getCurrentSession();
        Query query = session.createQuery("select count(*) from Order");
        return ((Long) query.uniqueResult()).intValue();
    }
}