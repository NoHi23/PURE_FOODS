package com.spring.entity;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "Orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderID")
    private int orderId;

    @Column(name = "CustomerID")
    private int customerID;

    @Column(name = "OrderDate", columnDefinition = "TIMESTAMP")
    private Timestamp orderDate;

    @Column(name = "TotalAmount")
    private double totalAmount;

    @Column(name = "StatusID")
    private int statusID;

    @Column(name = "ShippingAddress", length = 255)
    private String shippingAddress;

    @Column(name = "ShippingMethodID")
    private int shippingMethodID;

    @Column(name = "ShippingCost")
    private double shippingCost;

    @Column(name = "Distance")
    private double distance;

    @Column(name = "DiscountAmount")
    private double discountAmount;

    @Column(name = "Status")
    private int status;

    @Column(name = "CancelReason", length = 255)
    private String cancelReason;

    @Column(name = "EstimatedDeliveryDate", columnDefinition = "TIMESTAMP")
    private Timestamp estimatedDeliveryDate;

    @Column(name = "DelayReason", length = 255)
    private String delayReason;

    @Column(name = "DriverID")
    private Integer driverID;

    @Column(name = "ReturnReason", length = 255)
    private String returnReason;

    @ManyToOne
    @JoinColumn(name = "CustomerID", insertable = false, updatable = false)
    private User user;

    @OneToMany(mappedBy = "order")
    private List<OrderDetails> orderDetails;

    public Order() {}

    // Getters & Setters (lược bớt để ngắn gọn)
    public int getOrderId() { return orderId; }
    public void setOrderId(int orderId) { this.orderId = orderId; }
    public int getCustomerID() { return customerID; }
    public void setCustomerID(int customerID) { this.customerID = customerID; }
    public Timestamp getOrderDate() { return orderDate; }
    public void setOrderDate(Timestamp orderDate) { this.orderDate = orderDate; }
    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
    public int getStatusID() { return statusID; }
    public void setStatusID(int statusID) { this.statusID = statusID; }
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public int getShippingMethodID() { return shippingMethodID; }
    public void setShippingMethodID(int shippingMethodID) { this.shippingMethodID = shippingMethodID; }
    public double getShippingCost() { return shippingCost; }
    public void setShippingCost(double shippingCost) { this.shippingCost = shippingCost; }
    public double getDistance() { return distance; }
    public void setDistance(double distance) { this.distance = distance; }
    public double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(double discountAmount) { this.discountAmount = discountAmount; }
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
    public String getCancelReason() { return cancelReason; }
    public void setCancelReason(String cancelReason) { this.cancelReason = cancelReason; }
    public Timestamp getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(Timestamp estimatedDeliveryDate) { this.estimatedDeliveryDate = estimatedDeliveryDate; }
    public String getDelayReason() { return delayReason; }
    public void setDelayReason(String delayReason) { this.delayReason = delayReason; }
    public Integer getDriverID() { return driverID; }
    public void setDriverID(Integer driverID) { this.driverID = driverID; }
    public String getReturnReason() { return returnReason; }
    public void setReturnReason(String returnReason) { this.returnReason = returnReason; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public List<OrderDetails> getOrderDetails() { return orderDetails; }
    public void setOrderDetails(List<OrderDetails> orderDetails) { this.orderDetails = orderDetails; }
}