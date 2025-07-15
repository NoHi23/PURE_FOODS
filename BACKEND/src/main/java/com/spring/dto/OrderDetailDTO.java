package com.spring.dto;

public class OrderDetailDTO {
    private int orderDetailId;
    private int orderId;
    private int productId;
    private int quantity;
    private double unitPrice;
    private int status;

    public OrderDetailDTO() {}

    public OrderDetailDTO(int orderDetailId, int orderId, int productId, int quantity, double unitPrice, int status) {
        this.orderDetailId = orderDetailId;
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.status = status;
    }

    // Getters & Setters
    public int getOrderDetailId() { return orderDetailId; }
    public void setOrderDetailId(int orderDetailId) { this.orderDetailId = orderDetailId; }
    public int getOrderId() { return orderId; }
    public void setOrderId(int orderId) { this.orderId = orderId; }
    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
}