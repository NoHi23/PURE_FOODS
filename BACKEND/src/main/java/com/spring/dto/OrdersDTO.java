package com.spring.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrdersDTO {
    private int orderId;
    private Integer customerId;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private Integer statusId;
    private String shippingAddress;
    private Integer shippingMethodId;
    private BigDecimal shippingCost;
    private BigDecimal distance;
    private BigDecimal discountAmount;
    private Integer status;
    private String cancelReason;
    private LocalDateTime estimatedDeliveryDate;
    private String delayReason;
    private Integer driverId;
    private String returnReason;

    // Constructors
    public OrdersDTO() {}

    public OrdersDTO(int orderId, Integer customerId, LocalDateTime orderDate, BigDecimal totalAmount,
                     Integer statusId, String shippingAddress, Integer shippingMethodId, BigDecimal shippingCost,
                     BigDecimal distance, BigDecimal discountAmount, Integer status, String cancelReason,
                     LocalDateTime estimatedDeliveryDate, String delayReason, Integer driverId, String returnReason) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.statusId = statusId;
        this.shippingAddress = shippingAddress;
        this.shippingMethodId = shippingMethodId;
        this.shippingCost = shippingCost;
        this.distance = distance;
        this.discountAmount = discountAmount;
        this.status = status;
        this.cancelReason = cancelReason;
        this.estimatedDeliveryDate = estimatedDeliveryDate;
        this.delayReason = delayReason;
        this.driverId = driverId;
        this.returnReason = returnReason;
    }

    // Getters and Setters
    public int getOrderId() { return orderId; }
    public void setOrderId(int orderId) { this.orderId = orderId; }
    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public Integer getStatusId() { return statusId; }
    public void setStatusId(Integer statusId) { this.statusId = statusId; }
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public Integer getShippingMethodId() { return shippingMethodId; }
    public void setShippingMethodId(Integer shippingMethodId) { this.shippingMethodId = shippingMethodId; }
    public BigDecimal getShippingCost() { return shippingCost; }
    public void setShippingCost(BigDecimal shippingCost) { this.shippingCost = shippingCost; }
    public BigDecimal getDistance() { return distance; }
    public void setDistance(BigDecimal distance) { this.distance = distance; }
    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public String getCancelReason() { return cancelReason; }
    public void setCancelReason(String cancelReason) { this.cancelReason = cancelReason; }
    public LocalDateTime getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(LocalDateTime estimatedDeliveryDate) { this.estimatedDeliveryDate = estimatedDeliveryDate; }
    public String getDelayReason() { return delayReason; }
    public void setDelayReason(String delayReason) { this.delayReason = delayReason; }
    public Integer getDriverId() { return driverId; }
    public void setDriverId(Integer driverId) { this.driverId = driverId; }
    public String getReturnReason() { return returnReason; }
    public void setReturnReason(String returnReason) { this.returnReason = returnReason; }
}