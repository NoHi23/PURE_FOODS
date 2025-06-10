package com.spring.service;

import com.spring.entity.Notifications;
import com.spring.entity.Orders;
import com.spring.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.spring.entity.User;
import com.spring.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import java.sql.Timestamp;
@Service
public class NotificationService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public Notifications sendNotification(Integer orderId, String message, String status) {
    Notifications notification = new Notifications();
    notification.setOrder(new Orders(orderId));
    notification.setMessage(message);
    notification.setStatus(status);
     notification.setSentAt(new java.sql.Timestamp(System.currentTimeMillis()));
    return notificationRepository.save(notification);
}

    public Notifications createSupportTicket(Notifications notification) {
        return notificationRepository.save(notification);
    }

    public Notifications getSupportTicket(Integer ticketId) {
        Optional<Notifications> notification = notificationRepository.findById(ticketId);
        return notification.orElse(null);
    }

   public void notifyImportRequestToImporters(String message, Integer orderId, String status) {
    List<User> sellers = userRepository.findByRoleID(3);
    for (User seller : sellers) {
        Notifications notification = new Notifications();
        notification.setUser(seller);
        notification.setMessage(message);
        notification.setOrder(new Orders(orderId));
        notification.setStatus(status);
        notification.setSentAt(new java.sql.Timestamp(System.currentTimeMillis()));
        notificationRepository.save(notification);
    }
}
}