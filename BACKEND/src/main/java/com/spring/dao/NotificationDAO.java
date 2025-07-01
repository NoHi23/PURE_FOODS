package com.spring.dao;

import com.spring.entity.Notifications;

import java.util.List;

public interface NotificationDAO {

    void save(Notifications notification);

    List<Notifications> getUnreadNotificationsByUserId(int userId);
    List<Notifications> getAllNotificationsByUserId(int userId);
    void markAsRead(int id);
    void markAllUnreadAsReadByUserId(int userId);
    List<Notifications> findByUserId(int userId);
    List<Notifications> findByUserIdAndIsReadFalse(int userId);
}