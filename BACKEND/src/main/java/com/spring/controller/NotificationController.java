package com.spring.controller;

import com.spring.entity.Notifications;
import com.spring.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    //@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @PostMapping("/send/{orderId}")
    public ResponseEntity<Notifications> sendNotification(
            @PathVariable("orderId") Integer orderId,
            @RequestParam("message") String message) {
        Notifications notification = notificationService.sendNotification(orderId, message, "Sent");
        return ResponseEntity.ok(notification);
    }

    //@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @PostMapping("/support/tickets")
    public ResponseEntity<Notifications> createSupportTicket(@RequestBody Notifications notification) {
        Notifications ticket = notificationService.createSupportTicket(notification);
        return ResponseEntity.ok(ticket);
    }

    //@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @GetMapping("/support/tickets/{ticketId}")
    public ResponseEntity<Notifications> getSupportTicket(@PathVariable("ticketId") Integer ticketId) {
        Notifications ticket = notificationService.getSupportTicket(ticketId);
        if (ticket != null) {
            return ResponseEntity.ok(ticket);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
      // Gửi thông báo yêu cầu nhập hàng cho tất cả user có roleID = 3 (importer)
 @PostMapping("/import-request")
public ResponseEntity<Void> notifyImportRequest(
        @RequestParam("message") String message,
        @RequestParam("orderId") Integer orderId,
        @RequestParam("status") String status) {
    notificationService.notifyImportRequestToImporters(message, orderId, status);
    return ResponseEntity.ok().build();
}
}