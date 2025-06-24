package com.spring.entity;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "Orders")
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderID")
    private int orderId;

    @ManyToOne
    @JoinColumn(name = "SellerID", nullable = false)
    private Sellers seller;

    @Column(name = "OrderDate", columnDefinition = "DATETIME DEFAULT GETDATE()")
    private Timestamp orderDate;

    @ManyToOne
    @JoinColumn(name = "StatusID", nullable = false)
    private OrderStatuses status;

    @Column(name = "ShippingAddress", nullable = false, length = 255)
    private String shippingAddress;

    @ManyToOne
    @JoinColumn(name = "ShippingMethodID")
    private ShippingMethods shippingMethod;

    @Column(name = "ShippingCost", precision = 10, scale = 2)
    private Double shippingCost;

    @Column(name = "Distance", precision = 10, scale = 2)
    private Double distance;

    @Column(name = "DiscountAmount", precision = 10, scale = 2, columnDefinition = "DECIMAL(10,2) DEFAULT 0")
    private Double discountAmount;

    @Column(name = "TotalAmount", precision = 10, scale = 2)
    private Double totalAmount;

    @Column(name = "CancelReason", length = 255)
    private String cancelReason;

    @Column(name = "EstimatedDeliveryDate")
    private Timestamp estimatedDeliveryDate;

    @Column(name = "DelayReason", length = 255)
    private String delayReason;

    @ManyToOne
    @JoinColumn(name = "DriverID")
    private Drivers driver;

    @Column(name = "ReturnReason", length = 255)
    private String returnReason;

    @Column(name = "UpdatedAt", columnDefinition = "DATETIME DEFAULT GETDATE()")
    private Timestamp updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderDetails> orderDetails;

    // Getters và Setters
    public int getOrderId() { return orderId; }
    public void setOrderId(int orderId) { this.orderId = orderId; }
    public Sellers getSeller() { return seller; }
    public void setSeller(Sellers seller) { this.seller = seller; }
    public Timestamp getOrderDate() { return orderDate; }
    public void setOrderDate(Timestamp orderDate) { this.orderDate = orderDate; }
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
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public String getCancelReason() { return cancelReason; }
    public void setCancelReason(String cancelReason) { this.cancelReason = cancelReason; }
    public Timestamp getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(Timestamp estimatedDeliveryDate) { this.estimatedDeliveryDate = estimatedDeliveryDate; }
    public String getDelayReason() { return delayReason; }
    public void setDelayReason(String delayReason) { this.delayReason = delayReason; }
    public Drivers getDriver() { return driver; }
    public void setDriver(Drivers driver) { this.driver = driver; }
    public String getReturnReason() { return returnReason; }
    public void setReturnReason(String returnReason) { this.returnReason = returnReason; }
    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }
    public List<OrderDetails> getOrderDetails() { return orderDetails; }
    public void setOrderDetails(List<OrderDetails> orderDetails) { this.orderDetails = orderDetails; }
}