package com.spring.dto;

import java.util.Date;

public class InventoryLogsDTO {
    private int logId;
    private int productId;
    private int userId;
    private int quantityChange;
    private String reason;
    private Date createdAt;
    private Integer status;

    // Constructors
    public InventoryLogsDTO() {}

    public InventoryLogsDTO(int logId, int productId, int userId, int quantityChange, String reason, Date createdAt, Integer status) {
        this.logId = logId;
        this.productId = productId;
        this.userId = userId;
        this.quantityChange = quantityChange;
        this.reason = reason;
        this.createdAt = createdAt;
        this.status = status;
    }

    // Getters and Setters
    public int getLogId() { return logId; }
    public void setLogId(int logId) { this.logId = logId; }
    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public int getQuantityChange() { return quantityChange; }
    public void setQuantityChange(int quantityChange) { this.quantityChange = quantityChange; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
}