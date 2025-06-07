package com.spring.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Drivers", indexes = {@Index(name = "idx_driver_name", columnList = "DriverName")})
public class Drivers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DriverID")
    private Integer driverId;

    @Column(name = "DriverName", nullable = false)
    private String driverName;

    @Column(name = "Phone")
    private String phone;

    @Column(name = "Email")
    private String email;

    @Column(name = "VehicleInfo")
    private String vehicleInfo;

    @Column(name = "CreatedAt", nullable = false, updatable = false, columnDefinition = "DATETIME DEFAULT GETDATE()")
    private java.sql.Timestamp createdAt;

    @Column(name = "Status")
    private Integer status;

    // Default constructor
    public Drivers(Integer driverId) {
    this.driverId = driverId;
}

    // Getters and Setters
    public Integer getDriverId() { return driverId; }
    public void setDriverId(Integer driverId) { this.driverId = driverId; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getVehicleInfo() { return vehicleInfo; }
    public void setVehicleInfo(String vehicleInfo) { this.vehicleInfo = vehicleInfo; }
    public java.sql.Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.sql.Timestamp createdAt) { this.createdAt = createdAt; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
}