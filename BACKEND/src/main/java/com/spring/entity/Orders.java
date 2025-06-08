package com.spring.entity;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "Orders", indexes = {
    @Index(name = "idx_customer_id", columnList = "CustomerID"),
    @Index(name = "idx_order_date", columnList = "OrderDate"),
    @Index(name = "idx_status_id", columnList = "StatusID")
})
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderID")
    private Integer orderId;

    @ManyToOne
    @JoinColumn(name = "CustomerID", referencedColumnName = "UserID")
    private User customer;

    @Column(name = "OrderDate", nullable = false, updatable = false, columnDefinition = "DATETIME DEFAULT GETDATE()")
    private Timestamp orderDate;

    @Column(name = "TotalAmount", nullable = false)
    private Double totalAmount;

    @ManyToOne
    @JoinColumn(name = "StatusID", referencedColumnName = "StatusID")
    private OrderStatuses status;

    @Column(name = "ShippingAddress", nullable = false)
    private String shippingAddress;

    @ManyToOne
    @JoinColumn(name = "ShippingMethodID", referencedColumnName = "ShippingMethodID")
    private ShippingMethods shippingMethod;

    @Column(name = "ShippingCost")
    private Double shippingCost;

    @Column(name = "Distance")
    private Double distance;

    @Column(name = "DiscountAmount", columnDefinition = "DECIMAL(10, 2) DEFAULT 0")
    private Double discountAmount;

    @Column(name = "CancelReason")
    private String cancelReason;

    @Column(name = "EstimatedDeliveryDate")
    private Timestamp estimatedDeliveryDate;

    @Column(name = "DelayReason")
    private String delayReason;

    @Column(name = "ReturnReason")
    private String returnReason;

    @ManyToOne
    @JoinColumn(name = "DriverID", referencedColumnName = "DriverID")
    private Drivers driver;

    // Default constructor
    public Orders() {
        // Default constructor
    }
    public Orders(Integer orderId) {
        this.orderId = orderId;
    }

    // Getters and Setters
    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }
    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }
    public Timestamp getOrderDate() { return orderDate; }
    public void setOrderDate(Timestamp orderDate) { this.orderDate = orderDate; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public OrderStatuses getStatus() { return status; }
    public void setStatus(OrderStatuses status) { this.status = status; }
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public ShippingMethods getShippingMethod() { return shippingMethod; }
    public void setShippingMethod(ShippingMethods shippingMethod) { this.shippingMethod = shippingMethod; }
    public Double getShippingCost() { return shippingCost; }
    public void setShippingCost(Double shippingCost) { this.shippingCost = shippingCost; }
    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }
    public Double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Double discountAmount) { this.discountAmount = discountAmount; }
    public String getCancelReason() { return cancelReason; }
    public void setCancelReason(String cancelReason) { this.cancelReason = cancelReason; }
    public Timestamp getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(Timestamp estimatedDeliveryDate) { this.estimatedDeliveryDate = estimatedDeliveryDate; }
    public String getDelayReason() { return delayReason; }
    public void setDelayReason(String delayReason) { this.delayReason = delayReason; }
    public String getReturnReason() { return returnReason; }
    public void setReturnReason(String returnReason) { this.returnReason = returnReason; }
    public Drivers getDriver() { return driver; }
    public void setDriver(Drivers driver) { this.driver = driver; }
}