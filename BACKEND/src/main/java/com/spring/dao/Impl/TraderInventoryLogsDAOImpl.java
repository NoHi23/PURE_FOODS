package com.spring.dao.Impl;

import com.spring.dao.TraderInventoryLogsDAO;
import com.spring.entity.TraderInventoryLogs;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class TraderInventoryLogsDAOImpl implements TraderInventoryLogsDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public TraderInventoryLogs getTraderInventoryLogById(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(TraderInventoryLogs.class, id);
    }

    @Override
    public List<TraderInventoryLogs> getAllTraderInventoryLogs() {
        Session session = sessionFactory.getCurrentSession();
        Query<TraderInventoryLogs> query = session.createQuery("FROM TraderInventoryLogs WHERE status = 1", TraderInventoryLogs.class);
        return query.getResultList();
    }

    @Override
    public TraderInventoryLogs createTraderInventoryLog(TraderInventoryLogs traderInventoryLog) {
        Session session = sessionFactory.getCurrentSession();
        session.save(traderInventoryLog);
        return traderInventoryLog;
    }

    @Override
    public TraderInventoryLogs updateTraderInventoryLog(TraderInventoryLogs traderInventoryLog) {
        Session session = sessionFactory.getCurrentSession();
        session.update(traderInventoryLog);
        return traderInventoryLog;
    }

    @Override
    public void deleteTraderInventoryLog(int id) {
        Session session = sessionFactory.getCurrentSession();
        TraderInventoryLogs traderInventoryLog = session.get(TraderInventoryLogs.class, id);
        if (traderInventoryLog != null) {
            session.delete(traderInventoryLog);
        }
    }

    @Override
    public TraderInventoryLogs getLatestLog() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("FROM TraderInventoryLogs ORDER BY logId DESC", TraderInventoryLogs.class)
                .setMaxResults(1)
                .uniqueResult();
    }
}