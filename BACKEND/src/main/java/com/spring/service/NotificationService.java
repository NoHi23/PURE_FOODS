package com.spring.service;

import com.spring.entity.Notifications;
import com.spring.entity.Orders;
import com.spring.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notifications sendNotification(Integer orderId, String message) {
        Notifications notification = new Notifications();
        notification.setOrder(new Orders(orderId));
        notification.setMessage(message);
        return notificationRepository.save(notification);
    }

    public Notifications createSupportTicket(Notifications notification) {
        return notificationRepository.save(notification);
    }

    public Notifications getSupportTicket(Integer ticketId) {
        Optional<Notifications> notification = notificationRepository.findById(ticketId);
        return notification.orElse(null);
    }
}