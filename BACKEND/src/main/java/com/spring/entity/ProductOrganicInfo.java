package com.spring.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class ProductOrganicInfo {
    @Id
    private int productId;
    private int organicStatusId;
    private Integer status;

    // Constructors
    public ProductOrganicInfo() {}

    public ProductOrganicInfo(int productId, int organicStatusId, Integer status) {
        this.productId = productId;
        this.organicStatusId = organicStatusId;
        this.status = status;
    }

    // Getters and Setters
    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }
    public int getOrganicStatusId() { return organicStatusId; }
    public void setOrganicStatusId(int organicStatusId) { this.organicStatusId = organicStatusId; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
}