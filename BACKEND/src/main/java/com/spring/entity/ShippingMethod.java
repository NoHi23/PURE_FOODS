package com.spring.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "ShippingMethods")
public class ShippingMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ShippingMethodID")
    private int shippingMethodId;
    @Column(name = "MethodName", nullable = false, length = 100)
    private String methodName;
    // Getters and Setters
    public int getShippingMethodId() { return shippingMethodId; }
    public void setShippingMethodId(int shippingMethodId) { this.shippingMethodId = shippingMethodId; }
    public String getMethodName() { return methodName; }
    public void setMethodName(String methodName) { this.methodName = methodName; }
}