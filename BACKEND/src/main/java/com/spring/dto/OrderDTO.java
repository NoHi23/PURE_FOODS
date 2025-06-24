package com.spring.dto;
import java.sql.Timestamp;
public class OrderDTO {
    private int orderId;
    private int sellerId;
    private Timestamp orderDate;
    private String statusName;
    private String shippingAddress;
    private Double totalAmount;

    // Constructors
    public OrderDTO() {}
    public OrderDTO(int orderId, int sellerId, Timestamp orderDate, String statusName, String shippingAddress, Double totalAmount) {
        this.orderId = orderId;
        this.sellerId = sellerId;
        this.orderDate = orderDate;
        this.statusName = statusName;
        this.shippingAddress = shippingAddress;
        this.totalAmount = totalAmount;
    }

    // Getters và Setters
    public int getOrderId() { return orderId; }
    public void setOrderId(int orderId) { this.orderId = orderId; }
    public int getSellerId() { return sellerId; }
    public void setSellerId(int sellerId) { this.sellerId = sellerId; }
    public Timestamp getOrderDate() { return orderDate; }
    public void setOrderDate(Timestamp orderDate) { this.orderDate = orderDate; }
    public String getStatusName() { return statusName; }
    public void setStatusName(String statusName) { this.statusName = statusName; }
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
}
