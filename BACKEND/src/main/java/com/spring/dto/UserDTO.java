package com.spring.dto;

import java.sql.Timestamp;

public class UserDTO {
    private int userId;
    private String fullName;
    private String email;
    private String password;
    private int roleID;
    private String phone;
    private String address;
    private int status;
    private java.sql.Timestamp createdAt;
    private String resetToken;
    private Timestamp tokenExpiry;

    public UserDTO() {}

    public UserDTO(int userId, String fullName, String email, String password, int roleID, String phone, String address,int status, java.sql.Timestamp createdAt, String resetToken, Timestamp tokenExpiry) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.roleID = roleID;
        this.phone = phone;
        this.address = address;
        this.status = status;
        this.createdAt = createdAt;
        this.resetToken = resetToken;
        this.tokenExpiry = tokenExpiry;
    }

    public int getUserId() {
        return userId;
    }
    public void setUserId(int userId) {
        this.userId = userId;
    }
    public String getFullName() {
        return fullName;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public int getRoleID() {
        return roleID;
    }
    public void setRoleID(int roleID) {
        this.roleID = roleID;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public int getStatus() {
        return status;
    }
    public void setStatus(int status) {
        this.status = status;
    }
    public java.sql.Timestamp getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(java.sql.Timestamp createdAt) {
        this.createdAt = createdAt;
    }
    public String getResetToken() {
        return resetToken;
    }
    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }
    public Timestamp getTokenExpiry() {
        return tokenExpiry;
    }
    public void setTokenExpiry(Timestamp tokenExpiry) {
        this.tokenExpiry = tokenExpiry;
    }


}
