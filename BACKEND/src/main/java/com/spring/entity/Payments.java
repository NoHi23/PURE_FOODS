package com.spring.entity;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "Payments", indexes = {@Index(name = "idx_order_id", columnList = "OrderID")})
public class Payments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PaymentID")
    private Integer paymentId;

    @ManyToOne
    @JoinColumn(name = "OrderID", referencedColumnName = "OrderID")
    private Orders order;

    @ManyToOne
    @JoinColumn(name = "CustomerID", referencedColumnName = "UserID")
    private User customer;

    @Column(name = "PaymentMethod", nullable = false)
    private String paymentMethod;

    @Column(name = "Amount", nullable = false)
    private Double amount;

    @Column(name = "PaymentStatus", nullable = false)
    private String paymentStatus;

    @Column(name = "PaymentDate", nullable = false, updatable = false, columnDefinition = "DATETIME DEFAULT GETDATE()")
    private Timestamp paymentDate;

    @Column(name = "TransactionID")
    private String transactionId;

    @Column(name = "Status")
    private Integer status;

    // Getters and Setters
    public Integer getPaymentId() { return paymentId; }
    public void setPaymentId(Integer paymentId) { this.paymentId = paymentId; }
    public Orders getOrder() { return order; }
    public void setOrder(Orders order) { this.order = order; }
    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public Timestamp getPaymentDate() { return paymentDate; }
    public void setPaymentDate(Timestamp paymentDate) { this.paymentDate = paymentDate; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
}