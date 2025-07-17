package com.spring.dao.Impl;

import com.spring.dao.InventoryLogsDAO;
import com.spring.entity.InventoryLogs;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

// Bắt đầu thay đổi từ đây
@Repository
public class InventoryLogsDAOImpl implements InventoryLogsDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void addInventoryLog(InventoryLogs log) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(log); // Sử dụng Hibernate để lưu
    }

    @Override
    public List<InventoryLogs> getLogsByProductId(int productId) {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("FROM InventoryLogs WHERE productId = :productId AND status = 1", InventoryLogs.class)
                .setParameter("productId", productId)
                .list();
    }

    //thêm phương thức getLatestLog
    @Override
    public InventoryLogs getLatestLog() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("FROM InventoryLogs ORDER BY logId DESC", InventoryLogs.class)
                .setMaxResults(1)
                .uniqueResult();
    }

    @Override
    public List<InventoryLogs> getAllLogs() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("FROM InventoryLogs", InventoryLogs.class).list();
    }

    @Override
    public void updateInventoryLog(InventoryLogs log) {
        Session session = sessionFactory.getCurrentSession();
        session.update(log);
    }

    @Override
    public InventoryLogs getLogById(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(InventoryLogs.class, id);
    }

    @Override
    public List<InventoryLogs> getLogsByReasonAndStatus(String reason, int status) {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("FROM InventoryLogs WHERE reason = :reason AND status = :status", InventoryLogs.class)
                .setParameter("reason", reason)
                .setParameter("status", status)
                .list();
    }
    @Override
    public List<InventoryLogs> getLogsByUserId(int userId) {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("FROM InventoryLogs WHERE userId = :userId", InventoryLogs.class)
                .setParameter("userId", userId)
                .list();
    }
    @Override
    public List<InventoryLogs> getLogsByReason(String reason) {
        String hql = "FROM InventoryLogs WHERE reason = :reason ORDER BY createdAt DESC";
        return sessionFactory.getCurrentSession()
                .createQuery(hql, InventoryLogs.class)
                .setParameter("reason", reason)
                .list();
    }
}