package com.spring.entity;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "DeliveryTracking", indexes = {@Index(name = "idx_order_id", columnList = "OrderID")})
public class DeliveryTracking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TrackingID")
    private Integer trackingId;

    @ManyToOne
    @JoinColumn(name = "OrderID", referencedColumnName = "OrderID")
    private Orders order;

    @ManyToOne
    @JoinColumn(name = "DriverID", referencedColumnName = "DriverID")
    private Drivers driver;

    @Column(name = "Location")
    private String location;

    @Column(name = "UpdatedAt", nullable = false, updatable = false, columnDefinition = "DATETIME DEFAULT GETDATE()")
    private Timestamp updatedAt;

    @Column(name = "Status")
    private String status;

   }