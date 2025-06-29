package com.spring.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TraderTransactionDTO {
    private int transactionId;
    private int productId;
    private String productName;
    private int quantity;
    private String transactionType;
    private String supplierName;
    private String orderId;
    private BigDecimal transactionAmount; // Thêm để tính doanh thu
    private LocalDateTime transactionDate; // Thêm để hỗ trợ lọc theo thời gian

    // Constructors
    public TraderTransactionDTO() {}

    public TraderTransactionDTO(int transactionId, int productId, String productName, int quantity,
                                String transactionType, String supplierName, String orderId,
                                BigDecimal transactionAmount, LocalDateTime transactionDate) {
        this.transactionId = transactionId;
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.transactionType = transactionType;
        this.supplierName = supplierName;
        this.orderId = orderId;
        this.transactionAmount = transactionAmount;
        this.transactionDate = transactionDate;
    }

    // Getters and Setters
    public int getTransactionId() { return transactionId; }
    public void setTransactionId(int transactionId) { this.transactionId = transactionId; }
    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public BigDecimal getTransactionAmount() { return transactionAmount; }
    public void setTransactionAmount(BigDecimal transactionAmount) { this.transactionAmount = transactionAmount; }
    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }
}