package com.spring.dao.Impl;

import com.spring.dao.OrderDAO;
import com.spring.dto.BestSellingProductDTO;
import com.spring.dto.OrderDetailDTO;
import com.spring.entity.Order;
import com.spring.entity.Products;
import jakarta.persistence.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    @Override
    public List<Order> getOrdersByStatusID(int statusID) {
        String hql = "FROM Order o WHERE o.statusID = :statusID";
        return sessionFactory.getCurrentSession()
                .createQuery(hql, Order.class)
                .setParameter("statusID", statusID)
                .getResultList();
    }

    @Override
    public List<BestSellingProductDTO> getTop5BestSellingProductsWithStats() {
        String hql = "SELECT od.productID, SUM(od.quantity), SUM(od.quantity * od.unitPrice) " +
                "FROM OrderDetail od " +
                "GROUP BY od.productID " +
                "ORDER BY SUM(od.quantity) DESC";

        List<Object[]> results = sessionFactory.getCurrentSession()
                .createQuery(hql)
                .setMaxResults(5)
                .list();

        List<BestSellingProductDTO> dtoList = new ArrayList<>();
        for (Object[] row : results) {
            Integer productId = (Integer) row[0];
            Long totalQuantity = (Long) row[1];
            Double totalRevenue = (Double) row[2];

            Products product = sessionFactory.getCurrentSession().get(Products.class, productId);
            if (product != null) {
                dtoList.add(new BestSellingProductDTO(product, totalQuantity, totalRevenue));
            }
        }

        return dtoList;
    }

    @Override
    public List<Order> getTop5RecentOrders() {
        String hql = "FROM Order o ORDER BY o.orderDate DESC";
        return sessionFactory.getCurrentSession()
                .createQuery(hql, Order.class)
                .setMaxResults(5)
                .list();
    }

    @Override
    public Optional<Order> findById(int orderId) {
        Session session = sessionFactory.getCurrentSession();
        Order order = session.get(Order.class, orderId);
        return Optional.ofNullable(order);
    }
}
