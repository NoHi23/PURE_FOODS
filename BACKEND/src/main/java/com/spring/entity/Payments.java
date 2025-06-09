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


}