package com.spring.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "Orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer orderID;

    @Column(name = "customer_id")
    private Integer customerID;

    @Column(name = "order_date")
    private Date orderDate;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "status_id")
    private Integer statusID;

    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "shipping_method_id")
    private Integer shippingMethodID;

    @Column(name = "shipping_cost")
    private Double shippingCost;

    @Column(name = "distance")
    private Double distance;

    @Column(name = "discount_amount")
    private Double discountAmount;

    @Column(name = "cancel_reason")
    private String cancelReason;

    @Column(name = "estimated_delivery_date")
    private Date estimatedDeliveryDate;

    @Column(name = "delay_reason")
    private String delayReason;

    @Column(name = "driver_id")
    private Integer driverID;

    @Column(name = "return_reason")
    private String returnReason;

    // Getters and Setters
    public Integer getOrderID() { return orderID; }
    public void setOrderID(Integer orderID) { this.orderID = orderID; }
    public Integer getCustomerID() { return customerID; }
    public void setCustomerID(Integer customerID) { this.customerID = customerID; }
    public Date getOrderDate() { return orderDate; }
    public void setOrderDate(Date orderDate) { this.orderDate = orderDate; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public Integer getStatusID() { return statusID; }
    public void setStatusID(Integer statusID) { this.statusID = statusID; }
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public Integer getShippingMethodID() { return shippingMethodID; }
    public void setShippingMethodID(Integer shippingMethodID) { this.shippingMethodID = shippingMethodID; }
    public Double getShippingCost() { return shippingCost; }
    public void setShippingCost(Double shippingCost) { this.shippingCost = shippingCost; }
    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }
    public Double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Double discountAmount) { this.discountAmount = discountAmount; }
    public String getCancelReason() { return cancelReason; }
    public void setCancelReason(String cancelReason) { this.cancelReason = cancelReason; }
    public Date getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(Date estimatedDeliveryDate) { this.estimatedDeliveryDate = estimatedDeliveryDate; }
    public String getDelayReason() { return delayReason; }
    public void setDelayReason(String delayReason) { this.delayReason = delayReason; }
    public Integer getDriverID() { return driverID; }
    public void setDriverID(Integer driverID) { this.driverID = driverID; }
    public String getReturnReason() { return returnReason; }
    public void setReturnReason(String returnReason) { this.returnReason = returnReason; }
}