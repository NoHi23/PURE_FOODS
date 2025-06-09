package com.spring.entity;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "Notifications", indexes = {@Index(name = "idx_order_id", columnList = "OrderID")})
public class Notifications {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NotificationID")
    private Integer notificationId;

    @ManyToOne
    @JoinColumn(name = "OrderID", referencedColumnName = "OrderID")
    private Orders order;

    @ManyToOne
    @JoinColumn(name = "UserID", referencedColumnName = "UserID")
    private User user;

    @Column(name = "Message", nullable = false)
    private String message;

    @Column(name = "SentAt", nullable = false, updatable = false, columnDefinition = "DATETIME DEFAULT GETDATE()")
    private Timestamp sentAt;

    @Column(name = "Status")
    private String status;

  }