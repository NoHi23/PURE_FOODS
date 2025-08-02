package com.spring.service;

import com.spring.dto.NotificationDTO;
import com.spring.entity.Notifications;

import java.util.List;

public interface NotificationService {
    List<Notifications> unread(int uid);
    void read(int id);
    List<Notifications> all(int uid);
    int markAllAsRead(int userId);
    void saveNotification(Notifications notification);
    // Thêm mới
    void createNotification(NotificationDTO notification);
    void createPushNotification(NotificationDTO notification, String deviceToken);
    List<NotificationDTO> getNotificationsByUserId(int userId);
}