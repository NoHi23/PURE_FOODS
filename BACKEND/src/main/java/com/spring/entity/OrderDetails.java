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
    private Orders order;

    @ManyToOne
    @JoinColumn(name = "ProductID", nullable = false)
    private Products product;

    @Column(name = "Quantity", nullable = false)
    private int quantity;

    @Column(name = "UnitPrice", nullable = false, precision = 10, scale = 2)
    private Double unitPrice;

    @Column(name = "Subtotal", precision = 10, scale = 2)
    private Double subtotal;

    @Column(name = "Status")
    private Integer status;

    @Column(name = "CreatedAt", columnDefinition = "DATETIME DEFAULT GETDATE()")
    private Timestamp createdAt;

    // Getters và Setters
    public int getOrderDetailId() { return orderDetailId; }
    public void setOrderDetailId(int orderDetailId) { this.orderDetailId = orderDetailId; }
    public Orders getOrder() { return order; }
    public void setOrder(Orders order) { this.order = order; }
    public Products getProduct() { return product; }
    public void setProduct(Products product) { this.product = product; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }
    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
