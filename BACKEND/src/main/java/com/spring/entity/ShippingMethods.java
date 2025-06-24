package com.spring.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ShippingMethods")
public class ShippingMethods {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ShippingMethodID")
    private int shippingMethodId;

    @Column(name = "MethodName", nullable = false, length = 100)
    private String methodName;

    @Column(name = "Description", length = 255)
    private String description;

    @Column(name = "Cost", nullable = false, precision = 10, scale = 2)
    private Double cost;

    @Column(name = "IsColdChain")
    private Boolean isColdChain;

    @Column(name = "EstimatedDeliveryTime", length = 50)
    private String estimatedDeliveryTime;

    @Column(name = "Status")
    private Integer status;

    // Getters và Setters
    public int getShippingMethodId() { return shippingMethodId; }
    public void setShippingMethodId(int shippingMethodId) { this.shippingMethodId = shippingMethodId; }
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
