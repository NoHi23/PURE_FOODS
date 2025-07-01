package com.spring.controller;


import com.spring.entity.Notifications;
import com.spring.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class NotificationController {
    @Autowired
    private NotificationService service;

    @GetMapping("/unread/{userId}")
    public List<Notifications> unread(@PathVariable("userId") int userId) {
        return service.unread(userId);
    }

    @GetMapping("/{userId}")
    public List<Notifications> all(@PathVariable("userId") int userId) {
        return service.all(userId);
    }

    @PutMapping("/{id}/read")
    public void markRead(@PathVariable("id") int id) {
        service.read(id);
    }

    @PutMapping("/mark-all-read/{userId}")
    public ResponseEntity<?> markAllRead(@PathVariable("userId") int userId) {
        int updated = service.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("updated", updated));
    }
}
