package com.spring.dao.Impl;

import com.spring.dao.OrderDAO;
import com.spring.entity.Order;
import jakarta.persistence.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class OrderDAOImpl implements OrderDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public Order saveOrder(Order order) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(order);
        return order;
    }

    @Override
    public void updateOrder(Order order) {
        Session session = sessionFactory.getCurrentSession();
        session.update(order);
    }

    @Override
    public void deleteOrder(int orderId) {
        Session session = sessionFactory.getCurrentSession();
        Order order = session.get(Order.class, orderId);
        if (order != null) {
            session.delete(order);
        }
    }

    @Override
    public Order getOrderById(int orderId) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(Order.class, orderId);
    }

    @Override
    public List<Order> getAllOrders() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("FROM Order", Order.class).list();
    }

    @Override
    public List<Order> getOrdersByCustomerId(int customerId) {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("FROM Order WHERE customerID = :customerId", Order.class)
                .setParameter("customerId", customerId)
                .list();
    }

    @Override
    public List<Order> getOrdersByStatus(String status) {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("FROM Order WHERE status = :status", Order.class)
                .setParameter("status", status)
                .list();
    }

    @Override
    public List<Order> getOrdersByDriverId(int driverId) {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("FROM Order WHERE driverID = :driverId", Order.class)
                .setParameter("driverId", driverId)
                .list();
    }

    @Override
    public int countOrder() {
        Session session = sessionFactory.getCurrentSession();
        Query query = session.createQuery("select count(*) from Order");
        return ((Long) ((org.hibernate.query.Query<?>) query).uniqueResult()).intValue();
    }
}
