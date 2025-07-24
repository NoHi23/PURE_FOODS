package com.spring.entity;

import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "Orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int orderID;

    private int customerID;
    private Date orderDate;
    private Double totalAmount;
    private int statusID;
    private String shippingAddress;
    private int shippingMethodID;
    private Double shippingCost;
    private Double distance;
    private Double discountAmount;
    private String status;
    private String cancelReason;
    private Date estimatedDeliveryDate;
    private String delayReason;
    private int driverID;
    private String returnReason;
    private String paymentMethod;
    private String paymentStatus;

    public Order() {
    }

    public Order(int orderID, int customerID, Date orderDate, Double totalAmount, int statusID, String shippingAddress, int shippingMethodID, Double shippingCost, Double distance, Double discountAmount, String status, String cancelReason, Date estimatedDeliveryDate, String delayReason, int driverID, String returnReason) {
        this.orderID = orderID;
        this.customerID = customerID;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.statusID = statusID;
        this.shippingAddress = shippingAddress;
        this.shippingMethodID = shippingMethodID;
        this.shippingCost = shippingCost;
        this.distance = distance;
        this.discountAmount = discountAmount;
        this.status = status;
        this.cancelReason = cancelReason;
        this.estimatedDeliveryDate = estimatedDeliveryDate;
        this.delayReason = delayReason;
        this.driverID = driverID;
        this.returnReason = returnReason;
    }

    public int getOrderID() {
        return orderID;
    }

    public void setOrderID(int orderID) {
        this.orderID = orderID;
    }

    public int getCustomerID() {
        return customerID;
    }

    public void setCustomerID(int customerID) {
        this.customerID = customerID;
    }

    public Date getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public int getStatusID() {
        return statusID;
    }

    public void setStatusID(int statusID) {
        this.statusID = statusID;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public int getShippingMethodID() {
        return shippingMethodID;
    }

    public void setShippingMethodID(int shippingMethodID) {
        this.shippingMethodID = shippingMethodID;
    }

    public Double getShippingCost() {
        return shippingCost;
    }

    public void setShippingCost(Double shippingCost) {
        this.shippingCost = shippingCost;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    public Double getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(Double discountAmount) {
        this.discountAmount = discountAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCancelReason() {
        return cancelReason;
    }

    public void setCancelReason(String cancelReason) {
        this.cancelReason = cancelReason;
    }

    public Date getEstimatedDeliveryDate() {
        return estimatedDeliveryDate;
    }

    public void setEstimatedDeliveryDate(Date estimatedDeliveryDate) {
        this.estimatedDeliveryDate = estimatedDeliveryDate;
    }

    public String getDelayReason() {
        return delayReason;
    }

    public void setDelayReason(String delayReason) {
        this.delayReason = delayReason;
    }

    public int getDriverID() {
        return driverID;
    }

    public void setDriverID(int driverID) {
        this.driverID = driverID;
    }

    public String getReturnReason() {
        return returnReason;
    }

    public void setReturnReason(String returnReason) {
        this.returnReason = returnReason;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    public String getPaymentStatus() {
        return paymentStatus;
    }
    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

}

