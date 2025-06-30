package com.spring.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Orders")
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(
            name = "OrderID"
    )
    private int orderID;
    @Column(
            name = "CustomerID"
    )
    private Integer customerID;
    @Column(
            name = "OrderDate"
    )
    private LocalDateTime orderDate;
    @Column(
            name = "TotalAmount"
    )
    private BigDecimal totalAmount;
    @Column(
            name = "StatusID"
    )
    private Integer statusID;
    @Column(
            name = "ShippingAddress"
    )
    private String shippingAddress;
    @Column(
            name = "ShippingMethodID"
    )
    private Integer shippingMethodID;
    @Column(
            name = "ShippingCost"
    )
    private BigDecimal shippingCost;
    @Column(
            name = "Distance"
    )
    private BigDecimal distance;
    @Column(
            name = "DiscountAmount"
    )
    private BigDecimal discountAmount;
    @Column(
            name = "Status"
    )
    private Integer status;
    @Column(
            name = "CancelReason"
    )
    private String cancelReason;
    @Column(
            name = "EstimatedDeliveryDate"
    )
    private LocalDateTime estimatedDeliveryDate;
    @Column(
            name = "DelayReason"
    )
    private String delayReason;
    @Column(
            name = "DriverID"
    )
    private Integer driverID;
    @Column(
            name = "ReturnReason"
    )
    private String returnReason;

    public int getOrderID() {
        return this.orderID;
    }

    public void setOrderID(int orderID) {
        this.orderID = orderID;
    }

    public Integer getCustomerID() {
        return this.customerID;
    }

    public void setCustomerID(Integer customerID) {
        this.customerID = customerID;
    }

    public LocalDateTime getOrderDate() {
        return this.orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public BigDecimal getTotalAmount() {
        return this.totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Integer getStatusID() {
        return this.statusID;
    }

    public void setStatusID(Integer statusID) {
        this.statusID = statusID;
    }

    public String getShippingAddress() {
        return this.shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public Integer getShippingMethodID() {
        return this.shippingMethodID;
    }

    public void setShippingMethodID(Integer shippingMethodID) {
        this.shippingMethodID = shippingMethodID;
    }

    public BigDecimal getShippingCost() {
        return this.shippingCost;
    }

    public void setShippingCost(BigDecimal shippingCost) {
        this.shippingCost = shippingCost;
    }

    public BigDecimal getDistance() {
        return this.distance;
    }

    public void setDistance(BigDecimal distance) {
        this.distance = distance;
    }

    public BigDecimal getDiscountAmount() {
        return this.discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public Integer getStatus() {
        return this.status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getCancelReason() {
        return this.cancelReason;
    }

    public void setCancelReason(String cancelReason) {
        this.cancelReason = cancelReason;
    }

    public LocalDateTime getEstimatedDeliveryDate() {
        return this.estimatedDeliveryDate;
    }

    public void setEstimatedDeliveryDate(LocalDateTime estimatedDeliveryDate) {
        this.estimatedDeliveryDate = estimatedDeliveryDate;
    }

    public String getDelayReason() {
        return this.delayReason;
    }

    public void setDelayReason(String delayReason) {
        this.delayReason = delayReason;
    }

    public Integer getDriverID() {
        return this.driverID;
    }

    public void setDriverID(Integer driverID) {
        this.driverID = driverID;
    }

    public String getReturnReason() {
        return this.returnReason;
    }

    public void setReturnReason(String returnReason) {
        this.returnReason = returnReason;
    }
}