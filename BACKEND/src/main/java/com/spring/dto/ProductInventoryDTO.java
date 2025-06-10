package com.spring.dto;

public class ProductInventoryDTO {
    public Integer productId;
    public String productName;
    public Integer stockQuantity;
    public Integer warningThreshold;
    public String orderDetailStatus;
    public Integer quantity; // Thêm trường này

    public ProductInventoryDTO(Integer productId, String productName, Integer stockQuantity, Integer warningThreshold, String orderDetailStatus, Integer quantity) {
        this.productId = productId;
        this.productName = productName;
        this.stockQuantity = stockQuantity;
        this.warningThreshold = warningThreshold;
        this.orderDetailStatus = orderDetailStatus;
        this.quantity = quantity;
    }
}