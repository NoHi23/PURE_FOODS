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

    // Getters and Setters
    public Integer getTrackingId() { return trackingId; }
    public void setTrackingId(Integer trackingId) { this.trackingId = trackingId; }
    public Orders getOrder() { return order; }
    public void setOrder(Orders order) { this.order = order; }
    public Drivers getDriver() { return driver; }
    public void setDriver(Drivers driver) { this.driver = driver; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}