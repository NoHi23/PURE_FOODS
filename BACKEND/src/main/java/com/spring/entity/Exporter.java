package com.spring.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Exporters")
public class Exporter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ExporterID")
    private Long exporterId;

    @Column(name = "UserID", nullable = false)
    private Long userId;

    @Column(name = "CustomerID")
    private Long customerId;

    @Column(name = "CustomerName")
    private String customerName;

    @Column(name = "Phone")
    private String phone;

    @Column(name = "Email")
    private String email;

    @Column(name = "ShippingAddress")
    private String shippingAddress;

    @Column(name = "DriverID")
    private Long driverId;

    @Column(name = "OrderDate")
    private LocalDateTime orderDate;

    @Column(name = "EstimatedDeliveryDate")
    private LocalDateTime estimatedDeliveryDate;

    @Column(name = "DelayReason")
    private String delayReason;

    @Column(name = "TotalAmount")
    private float totalAmount;

    @Column(name = "StatusID")
    private Integer statusId;

    @Column(name = "CancelReason")
    private String cancelReason;

    @Column(name = "ReturnReason")
    private String returnReason;

    @Column(name = "Source")
    private String source;

    @Column(name = "Status")
    private Integer status;

 @OneToMany(mappedBy = "exporterId", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ExporterDetail> items;

    public Exporter() {}

    // Getters and Setters
    public Long getExporterId() { return exporterId; }
    public void setExporterId(Long exporterId) { this.exporterId = exporterId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
    public LocalDateTime getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(LocalDateTime estimatedDeliveryDate) { this.estimatedDeliveryDate = estimatedDeliveryDate; }
    public String getDelayReason() { return delayReason; }
    public void setDelayReason(String delayReason) { this.delayReason = delayReason; }
    public float getTotalAmount() { return totalAmount; }
    public void setTotalAmount(float totalAmount) { this.totalAmount = totalAmount; }
    public Integer getStatusId() { return statusId; }
    public void setStatusId(Integer statusId) { this.statusId = statusId; }
    public String getCancelReason() { return cancelReason; }
    public void setCancelReason(String cancelReason) { this.cancelReason = cancelReason; }
    public String getReturnReason() { return returnReason; }
    public void setReturnReason(String returnReason) { this.returnReason = returnReason; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public List<ExporterDetail> getItems() { return items; }
    public void setItems(List<ExporterDetail> items) { this.items = items; }
}