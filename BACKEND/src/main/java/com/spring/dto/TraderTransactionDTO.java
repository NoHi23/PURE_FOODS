package com.spring.dto;

public class TraderTransactionDTO {
    private int traderId;
    private int productId;
    private int quantity;
    private String transactionType;
    private String supplierName;
    private String productName;
    private String orderId;


    public TraderTransactionDTO() {
    }


    public TraderTransactionDTO(int traderId, int productId, int quantity, String transactionType, String supplierName, String productName, String orderId) {
        this.traderId = traderId;
        this.productId = productId;
        this.quantity = quantity;
        this.transactionType = transactionType;
        this.supplierName = supplierName;
        this.productName = productName;
        this.orderId = orderId;
    }


    public int getTraderId() {
        return traderId;
    }

    public void setTraderId(int traderId) {
        this.traderId = traderId;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
}