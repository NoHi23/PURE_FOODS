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

  }