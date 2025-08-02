package com.spring.dto;

public class OrderStatusDTO {
    private int statusId;
    private String statusName;
    private String description;
    private Integer status;

    public OrderStatusDTO() {}

    public OrderStatusDTO(int statusId, String statusName, String description, Integer status) {
        this.statusId = statusId;
        this.statusName = statusName;
        this.description = description;
        this.status = status;
    }

    public int getStatusId() {
        return statusId;
    }

    public void setStatusId(int statusId) {
        this.statusId = statusId;
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

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}