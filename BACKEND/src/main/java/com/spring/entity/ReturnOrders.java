package com.spring.entity;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "ReturnOrders", indexes = {@Index(name = "idx_order_id", columnList = "OrderID")})
public class ReturnOrders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ReturnOrderID")
    private Integer returnOrderId;

    @ManyToOne
    @JoinColumn(name = "OrderID", referencedColumnName = "OrderID")
    private Orders order;

    @Column(name = "ReturnDate", nullable = false, updatable = false, columnDefinition = "DATETIME DEFAULT GETDATE()")
    private Timestamp returnDate;

    @Column(name = "ReturnReason")
    private String returnReason;

    @ManyToOne
    @JoinColumn(name = "StatusID", referencedColumnName = "StatusID")
    private OrderStatuses status;

    @ManyToOne
    @JoinColumn(name = "ProcessedBy", referencedColumnName = "UserID")
    private User processedBy;

    // Getters and Setters
    public Integer getReturnOrderId() { return returnOrderId; }
    public void setReturnOrderId(Integer returnOrderId) { this.returnOrderId = returnOrderId; }
    public Orders getOrder() { return order; }
    public void setOrder(Orders order) { this.order = order; }
    public Timestamp getReturnDate() { return returnDate; }
    public void setReturnDate(Timestamp returnDate) { this.returnDate = returnDate; }
    public String getReturnReason() { return returnReason; }
    public void setReturnReason(String returnReason) { this.returnReason = returnReason; }
    public OrderStatuses getStatus() { return status; }
    public void setStatus(OrderStatuses status) { this.status = status; }
    public User getProcessedBy() { return processedBy; }
    public void setProcessedBy(User processedBy) { this.processedBy = processedBy; }
}