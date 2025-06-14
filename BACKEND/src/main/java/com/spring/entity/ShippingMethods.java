package com.spring.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ShippingMethods", indexes = {@Index(name = "idx_method_name", columnList = "MethodName")})
public class ShippingMethods {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ShippingMethodID")
    private Integer shippingMethodId;

    @Column(name = "MethodName", nullable = false)
    private String methodName;

    @Column(name = "Description")
    private String description;

    @Column(name = "Cost", nullable = false)
    private Double cost;

    @Column(name = "IsColdChain", columnDefinition = "BIT DEFAULT 0")
    private Boolean isColdChain;

    @Column(name = "EstimatedDeliveryTime")
    private String estimatedDeliveryTime;

    @Column(name = "Status")
    private Integer status;

    // Getters and Setters
    public Integer getShippingMethodId() { return shippingMethodId; }
    public void setShippingMethodId(Integer shippingMethodId) { this.shippingMethodId = shippingMethodId; }
    public String getMethodName() { return methodName; }
    public void setMethodName(String methodName) { this.methodName = methodName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getCost() { return cost; }
    public void setCost(Double cost) { this.cost = cost; }
    public Boolean getIsColdChain() { return isColdChain; }
    public void setIsColdChain(Boolean isColdChain) { this.isColdChain = isColdChain; }
    public String getEstimatedDeliveryTime() { return estimatedDeliveryTime; }
    public void setEstimatedDeliveryTime(String estimatedDeliveryTime) { this.estimatedDeliveryTime = estimatedDeliveryTime; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
}