package com.spring.service;

import com.spring.entity.Notifications;

import java.util.List;

public interface NotificationService {

    public List<Notifications> unread(int uid);
    public void read(int id) ;

    public List<Notifications> all(int uid) ;

    public int markAllAsRead(int userId);
    void saveNotification(Notifications notification);

}
