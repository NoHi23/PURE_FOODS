package com.spring.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "Drivers")
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DriverID")
    private int driverId;
    @Column(name = "DriverName", nullable = false, length = 100)
    private String driverName;
    // Getters and Setters
    public int getDriverId() { return driverId; }
    public void setDriverId(int driverId) { this.driverId = driverId; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
}