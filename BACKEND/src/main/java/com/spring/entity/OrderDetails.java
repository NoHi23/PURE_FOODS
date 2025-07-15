package com.spring.entity;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "OrderDetails")
public class OrderDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderDetailID")
    private int orderDetailId;

    @ManyToOne
    @JoinColumn(name = "OrderID", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "ProductID", nullable = false)
    private Products product;

    @Column(name = "Quantity", nullable = false)
    private int quantity;

    @Column(name = "UnitPrice", nullable = false)
    private double unitPrice;

    @Column(name = "Status")
    private int status;

    public OrderDetails() {}

    // Getters & Setters
    public int getOrderDetailId() { return orderDetailId; }
    public void setOrderDetailId(int orderDetailId) { this.orderDetailId = orderDetailId; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    public Products getProduct() { return product; }
    public void setProduct(Products product) { this.product = product; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
}