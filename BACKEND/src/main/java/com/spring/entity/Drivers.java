package com.spring.entity;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "Drivers")
public class Drivers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DriverID")
    private int driverId;

    @Column(name = "DriverName", nullable = false, length = 100)
    private String driverName;

    @Column(name = "Phone", length = 20)
    private String phone;

    @Column(name = "Email", length = 100)
    private String email;

    @Column(name = "VehicleInfo", length = 255)
    private String vehicleInfo;

    @Column(name = "CreatedAt", columnDefinition = "DATETIME DEFAULT GETDATE()")
    private Timestamp createdAt;

    @Column(name = "Status")
    private Integer status;

    // Getters và Setters
    public int getDriverId() { return driverId; }
    public void setDriverId(int driverId) { this.driverId = driverId; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getVehicleInfo() { return vehicleInfo; }
    public void setVehicleInfo(String vehicleInfo) { this.vehicleInfo = vehicleInfo; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
}