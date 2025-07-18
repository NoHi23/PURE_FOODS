package com.spring.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class TraderInventoryLogs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int logId;
    private int traderProductId;
    private int userId;
    private int quantityChange;
    @Column(updatable = false)
    private Date createdAt;
    private int status; // 0: Gửi yêu cầu, 1: Xác nhận

    // Constructors
    public TraderInventoryLogs() {}

    public TraderInventoryLogs(int logId, int traderProductId, int userId, int quantityChange, Date createdAt, int status) {
        this.logId = logId;
        this.traderProductId = traderProductId;
        this.userId = userId;
        this.quantityChange = quantityChange;
        this.createdAt = createdAt;
        this.status = status;
    }

    // Getters and Setters
    public int getLogId() { return logId; }
    public void setLogId(int logId) { this.logId = logId; }
    public int getTraderProductId() { return traderProductId; }
    public void setTraderProductId(int traderProductId) { this.traderProductId = traderProductId; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public int getQuantityChange() { return quantityChange; }
    public void setQuantityChange(int quantityChange) { this.quantityChange = quantityChange; }
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
}