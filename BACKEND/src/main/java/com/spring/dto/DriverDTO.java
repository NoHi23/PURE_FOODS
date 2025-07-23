package com.spring.dto;

public class DriverDTO {

    private Long driverId;
    private String driverName; // Sửa từ name thành driverName
    private String phone;
    private String email;
    private String vehicleInfo; // Đồng bộ với VehicleInfo trong bảng Drivers
    private Integer status; // Sửa từ String thành Integer

    public DriverDTO() {}

    public DriverDTO(Long driverId, String driverName, String phone, String email, String vehicleInfo, Integer status) {
        this.driverId = driverId;
        this.driverName = driverName;
        this.phone = phone;
        this.email = email;
        this.vehicleInfo = vehicleInfo;
        this.status = status;
    }

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getVehicleInfo() {
        return vehicleInfo;
    }

    public void setVehicleInfo(String vehicleInfo) {
        this.vehicleInfo = vehicleInfo;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}