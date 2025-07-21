package com.spring.dto;

import java.util.Date;

public class OrderDTO {
    private Integer orderID;
    private Integer customerID;
    private Date orderDate;
    private Double totalAmount;
    private Integer statusID; // Chỉ sử dụng statusID
    private String shippingAddress;
    private Integer shippingMethodID;
    private Double shippingCost;
    private Double distance;
    private Double discountAmount;
    private String cancelReason;
    private Date estimatedDeliveryDate;
    private String delayReason;
    private Integer driverID;
    private String returnReason;
    private String paymentMethod;
    private String paymentStatus;

    public OrderDTO() {}

    public OrderDTO(Integer orderID, Integer customerID) {
        this.orderID = orderID;
        this.customerID = customerID;
    }

    public OrderDTO(Integer orderID, Integer customerID, Date orderDate, Double totalAmount, Integer statusID,
                    String shippingAddress, Integer shippingMethodID, Double shippingCost, Double distance,
                    Double discountAmount, String cancelReason, Date estimatedDeliveryDate,
                    String delayReason, Integer driverID, String returnReason) {
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
        this.cancelReason = cancelReason;
        this.estimatedDeliveryDate = estimatedDeliveryDate;
        this.delayReason = delayReason;
        this.driverID = driverID;
        this.returnReason = returnReason;
    }

    public Integer getOrderID() {
        return orderID;
    }

    public void setOrderID(Integer orderID) {
        this.orderID = orderID;
    }

    public Integer getCustomerID() {
        return customerID;
    }

    public void setCustomerID(Integer customerID) {
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

    public Integer getStatusID() {
        return statusID;
    }

    public void setStatusID(Integer statusID) {
        this.statusID = statusID;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public Integer getShippingMethodID() {
        return shippingMethodID;
    }

    public void setShippingMethodID(Integer shippingMethodID) {
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

    public Integer getDriverID() {
        return driverID;
    }

    public void setDriverID(Integer driverID) {
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
    public String getPaymentStatus(){
        return paymentStatus;
    }
    public void setPaymentStatus(String paymentStatus){
        this.paymentStatus = paymentStatus;
    }

}