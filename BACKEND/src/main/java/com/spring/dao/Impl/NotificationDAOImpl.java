package com.spring.dao.Impl;

import com.spring.dao.NotificationDAO;
import com.spring.dto.NotificationDTO;
import com.spring.entity.Notifications;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

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

    @Override
    @Transactional
    public void saveNotificationDTO(NotificationDTO notification) {
        Notifications entity = new Notifications();
        entity.setUserId(notification.getUserId());
        entity.setTitle(notification.getTitle());
        entity.setContent(notification.getContent());
        entity.setIsRead(notification.getIsRead() != null ? notification.getIsRead() : false);
        entity.setCreatedAt((Timestamp) notification.getCreatedAt());
        entityManager.persist(entity);
        notification.setId(entity.getId());
    }

    @Override
    public List<NotificationDTO> getNotificationsByUserId(int userId) {
        List<Notifications> entities = getAllNotificationsByUserId(userId);
        return entities.stream().map(entity -> {
            NotificationDTO dto = new NotificationDTO();
            dto.setId(entity.getId());
            dto.setUserId(entity.getUserId());
            dto.setTitle(entity.getTitle());
            dto.setContent(entity.getContent());
            dto.setIsRead(entity.getIsRead());
            dto.setCreatedAt(entity.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());
    }
}