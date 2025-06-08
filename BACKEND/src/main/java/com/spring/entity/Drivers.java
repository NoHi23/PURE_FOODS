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

   }