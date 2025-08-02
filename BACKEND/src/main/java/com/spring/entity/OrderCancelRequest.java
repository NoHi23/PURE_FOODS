package com.spring.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "OrderCancelRequests")
public class OrderCancelRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private int id;

    @Column(name = "OrderID")
    private int orderID;

    @Column(name = "CustomerID")
    private int customerID;

    @Column(name = "CancelRequestReason")
    private String cancelRequestReason;

    @Column(name = "CancelRequestedAt")
    private Date cancelRequestedAt;

    @Column(name = "IsProcessed")
    private boolean isProcessed;

    public OrderCancelRequest() {
    }

    public OrderCancelRequest(int orderID, int customerID, String cancelRequestReason, Date cancelRequestedAt, boolean isProcessed) {
        this.orderID = orderID;
        this.customerID = customerID;
        this.cancelRequestReason = cancelRequestReason;
        this.cancelRequestedAt = cancelRequestedAt;
        this.isProcessed = isProcessed;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public String getCancelRequestReason() {
        return cancelRequestReason;
    }

    public void setCancelRequestReason(String cancelRequestReason) {
        this.cancelRequestReason = cancelRequestReason;
    }

    public Date getCancelRequestedAt() {
        return cancelRequestedAt;
    }

    public void setCancelRequestedAt(Date cancelRequestedAt) {
        this.cancelRequestedAt = cancelRequestedAt;
    }

    public boolean isProcessed() {
        return isProcessed;
    }

    public void setProcessed(boolean processed) {
        this.isProcessed = processed;
    }
}