package com.spring.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "OrderStatuses")
public class OrderStatuses {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "StatusID")
    private Integer statusId;

    @Column(name = "StatusName", nullable = false, unique = true)
    private String statusName;

    @Column(name = "Description")
    private String description;

    @Column(name = "Status")
    private Integer status;

    // Getters and Setters
    public Integer getStatusId() { return statusId; }
    public void setStatusId(Integer statusId) { this.statusId = statusId; }
    public String getStatusName() { return statusName; }
    public void setStatusName(String statusName) { this.statusName = statusName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
}