package com.spring.entity;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "InventoryLogs", indexes = {@Index(name = "idx_product_id", columnList = "ProductID")})
public class InventoryLogs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LogID")
    private Integer logId;

    @ManyToOne
    @JoinColumn(name = "ProductID", referencedColumnName = "ProductID")
    private Products product;

    @ManyToOne
    @JoinColumn(name = "UserID", referencedColumnName = "UserID")
    private User user;

    @Column(name = "QuantityChange", nullable = false)
    private Integer quantityChange;

    @Column(name = "Reason")
    private String reason;

    @Column(name = "CreatedAt", nullable = false, updatable = false, columnDefinition = "DATETIME DEFAULT GETDATE()")
    private Timestamp createdAt;

    @Column(name = "Status")
    private Integer status;

   }