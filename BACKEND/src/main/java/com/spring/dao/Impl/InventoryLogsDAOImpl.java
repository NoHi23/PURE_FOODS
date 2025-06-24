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
}