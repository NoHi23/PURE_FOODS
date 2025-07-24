package com.spring.dto;

import jakarta.persistence.Column;

public class OrderStatus {

    private int  statusID;

    private String statusName;

    private String description;

    private int status;

    public OrderStatus(){}

    public OrderStatus(int statusID, String statusName, String description, int status) {
        this.statusID = statusID;
        this.statusName = statusName;
        this.description = description;
        this.status = status;
    }
    public int getStatusID() {
        return statusID;
    }
    public void setStatusID(int statusID) {
        this.statusID = statusID;
    }
    public String getStatusName() {
        return statusName;
    }
    public void setStatusName(String statusName) {
        this.statusName = statusName;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public int getStatus() {
        return status;
    }
    public void setStatus(int status) {
        this.status = status;
    }
}
