package com.spring.dto;

import java.util.Date;

public class ExporterDTO {
    private int userID;
    private String fullName;
    private String email;
    private Integer roleID;
    private String phone;
    private String address;
    private Integer status;
    private Date createdAt;

    public ExporterDTO(int userID, String fullName, String email, Integer roleID, String phone, String address, Integer status, Date createdAt) {
        this.userID = userID;
        this.fullName = fullName;
        this.email = email;
        this.roleID = roleID;
        this.phone = phone;
        this.address = address;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public int getUserID() { return userID; }
    public void setUserID(int userID) { this.userID = userID; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Integer getRoleID() { return roleID; }
    public void setRoleID(Integer roleID) { this.roleID = roleID; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}