package com.spring.dao;

import com.spring.dto.NotificationDTO;
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
    // Thêm mới
    void saveNotificationDTO(NotificationDTO notification);
    List<NotificationDTO> getNotificationsByUserId(int userId);
}