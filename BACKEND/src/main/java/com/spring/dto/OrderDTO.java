package com.spring.dto;

import java.sql.Timestamp;
import java.util.List;

public class OrderDTO {
    private int orderId;
    private int customerID;
    private Timestamp orderDate;
    private double totalAmount;
    private int statusID;
    private String shippingAddress;
    private int shippingMethodID;
    private double shippingCost;
    private double distance;
    private double discountAmount;
    private int status;
    private String cancelReason;
    private Timestamp estimatedDeliveryDate;
    private String delayReason;
    private Integer driverID;
    private String returnReason;
    private List<OrderDetailDTO> orderDetails;

    public OrderDTO() {}

    public OrderDTO(int orderId, int customerID, Timestamp orderDate, double totalAmount, int statusID, String shippingAddress,
                    int shippingMethodID, double shippingCost, double distance, double discountAmount, int status,
                    String cancelReason, Timestamp estimatedDeliveryDate, String delayReason, Integer driverID,
                    String returnReason, List<OrderDetailDTO> orderDetails) {
        this.orderId = orderId;
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
        this.orderDetails = orderDetails;
    }

    public int getOrderId() {
        return orderId;
    }
    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }
    public int getCustomerID() {
        return customerID;
    }
    public void setCustomerID(int customerID) {
        this.customerID = customerID;
    }
    public Timestamp getOrderDate() {
        return orderDate;
    }
    public void setOrderDate(Timestamp orderDate) {
        this.orderDate = orderDate;
    }
    public double getTotalAmount() {
        return totalAmount;
    }
    public void setTotalAmount(double totalAmount) {
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
    public double getShippingCost() {
        return shippingCost;
    }
    public void setShippingCost(double shippingCost) {
        this.shippingCost = shippingCost;
    }
    public double getDistance() {
        return distance;
    }
    public void setDistance(double distance) {
        this.distance = distance;
    }
    public double getDiscountAmount() {
        return discountAmount;
    }
    public void setDiscountAmount(double discountAmount) {
        this.discountAmount = discountAmount;
    }
    public int getStatus() {
        return status;
    }
    public void setStatus(int status) {
        this.status = status;
    }
    public String getCancelReason() {
        return cancelReason;
    }
    public void setCancelReason(String cancelReason) {
        this.cancelReason = cancelReason;
    }
    public Timestamp getEstimatedDeliveryDate() {
        return estimatedDeliveryDate;
    }
    public void setEstimatedDeliveryDate(Timestamp estimatedDeliveryDate) {
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
    public List<OrderDetailDTO> getOrderDetails() {
        return orderDetails;
    }
    public void setOrderDetails(List<OrderDetailDTO> orderDetails) {
        this.orderDetails = orderDetails;
    }
}