package com.spring.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "OrderDetails", indexes = {@Index(name = "idx_order_id", columnList = "OrderID")})
public class OrderDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderDetailID")
    private Integer orderDetailId;

    @ManyToOne
    @JoinColumn(name = "OrderID", referencedColumnName = "OrderID")
    private Orders order;

    @ManyToOne
    @JoinColumn(name = "ProductID", referencedColumnName = "ProductID")
    private Products product;

    @Column(name = "Quantity", nullable = false, columnDefinition = "INT CHECK (Quantity > 0)")
    private Integer quantity;

    @Column(name = "UnitPrice", nullable = false)
    private Double unitPrice;

    @Column(name = "Status")
    private Integer status;

    // Getters and Setters
    public Integer getOrderDetailId() { return orderDetailId; }
    public void setOrderDetailId(Integer orderDetailId) { this.orderDetailId = orderDetailId; }
    public Orders getOrder() { return order; }
    public void setOrder(Orders order) { this.order = order; }
    public Products getProduct() { return product; }
    public void setProduct(Products product) { this.product = product; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
}