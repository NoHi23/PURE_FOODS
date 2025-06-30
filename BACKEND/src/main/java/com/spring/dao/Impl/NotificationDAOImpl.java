package com.spring.dao.Impl;

import com.spring.dao.NotificationDAO;
import com.spring.entity.Notifications;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class NotificationDAOImpl implements NotificationDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void save(Notifications notification) {
        entityManager.persist(notification);
    }

    @Override
    public List<Notifications> getUnreadNotificationsByUserId(int userId) {
        String jpql = "FROM Notifications n WHERE n.userId = :userId AND n.isRead = false";
        return entityManager.createQuery(jpql, Notifications.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    @Override
    public List<Notifications> getAllNotificationsByUserId(int uid) {
        String jpql = "FROM Notifications n WHERE n.userId = :uid ORDER BY n.createdAt DESC";
        return entityManager.createQuery(jpql, Notifications.class)
                .setParameter("uid", uid)
                .getResultList();
    }
    @Transactional
    @Override
    public void markAsRead(int id) {
        String jpql = "UPDATE Notifications n SET n.isRead = true WHERE n.id = :id";
        entityManager.createQuery(jpql).setParameter("id", id).executeUpdate();
    }


    @Override
    public void markAllUnreadAsReadByUserId(int userId) {
        String hql = """
            UPDATE Notifications n
            SET n.isRead = true
            WHERE n.userId = :uid AND n.isRead = false
        """;
        entityManager.createQuery(hql)
                .setParameter("uid", userId)
                .executeUpdate();
    }


    @Override
    public List<Notifications> findByUserId(int userId) {
        return getAllNotificationsByUserId(userId);
    }

    @Override
    public List<Notifications> findByUserIdAndIsReadFalse(int userId) {
        return getUnreadNotificationsByUserId(userId);
    }

}