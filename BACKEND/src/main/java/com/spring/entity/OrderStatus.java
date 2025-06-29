package com.spring.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "OrderStatuses")
public class OrderStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "StatusID")
    private int statusId;
    @Column(name = "StatusName", nullable = false, length = 50)
    private String statusName;
    // Getters and Setters
    public int getStatusId() { return statusId; }
    public void setStatusId(int statusId) { this.statusId = statusId; }
    public String getStatusName() { return statusName; }
    public void setStatusName(String statusName) { this.statusName = statusName; }
}