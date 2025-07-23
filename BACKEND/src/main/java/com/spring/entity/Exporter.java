package com.spring.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "Exporters")
public class Exporter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int exporterID;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "customerID")
    private User customer;

    @Column(name = "customerName")
    private String customerName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "shippingAddress")
    private String shippingAddress;

    @ManyToOne
    @JoinColumn(name = "driverID")
    private Driver driver;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "orderDate")
    private Date orderDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "estimatedDeliveryDate")
    private Date estimatedDeliveryDate;

    @Column(name = "delayReason")
    private String delayReason;

    @Column(name = "totalAmount", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @ManyToOne
    @JoinColumn(name = "statusID")
    private OrderStatus statusRef;

    @Column(name = "cancelReason")
    private String cancelReason;

    @Column(name = "returnReason")
    private String returnReason;

    @Column(name = "source")
    private String source;

    @Column(name = "status")
    private Integer status;

    // Constructors
    public Exporter() {
    }

    // Getters & Setters
    public int getExporterID() {
        return exporterID;
    }

    public void setExporterID(int exporterID) {
        this.exporterID = exporterID;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public Driver getDriver() {
        return driver;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }

    public Date getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }

    public Date getEstimatedDeliveryDate() {
        return estimatedDeliveryDate;
    }

    public void setEstimatedDeliveryDate(Date estimatedDeliveryDate) {
        this.estimatedDeliveryDate = estimatedDeliveryDate;
    }

    public String getDelayReason() {
        return delayReason;
    }

    public void setDelayReason(String delayReason) {
        this.delayReason = delayReason;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public OrderStatus getStatusRef() {
        return statusRef;
    }

    public void setStatusRef(OrderStatus statusRef) {
        this.statusRef = statusRef;
    }

    public String getCancelReason() {
        return cancelReason;
    }

    public void setCancelReason(String cancelReason) {
        this.cancelReason = cancelReason;
    }

    public String getReturnReason() {
        return returnReason;
    }

    public void setReturnReason(String returnReason) {
        this.returnReason = returnReason;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
