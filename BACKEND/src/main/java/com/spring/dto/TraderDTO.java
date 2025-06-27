package com.spring.dto;

import java.sql.Timestamp;

public class TraderDTO {
    private int traderId;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private Timestamp createdAt;
    private int status;


    public TraderDTO() {
    }


    public TraderDTO(int traderId, String fullName, String email, String phone, String address, Timestamp createdAt, int status) {
        this.traderId = traderId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.createdAt = createdAt;
        this.status = status;
    }


    public int getTraderId() {
        return traderId;
    }

    public void setTraderId(int traderId) {
        this.traderId = traderId;
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

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}