package com.spring.entity;

import java.util.Date;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class ProductDetails {
    @Id
    private int productId;
    private Date harvestDate;
    private Date expirationDate;
    private String nutritionalInfo;
    private Integer status;

    // Constructors
    public ProductDetails() {}

    public ProductDetails(int productId, Date harvestDate, Date expirationDate, String nutritionalInfo, Integer status) {
        this.productId = productId;
        this.harvestDate = harvestDate;
        this.expirationDate = expirationDate;
        this.nutritionalInfo = nutritionalInfo;
        this.status = status;
    }

    // Getters and Setters
    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }
    public Date getHarvestDate() { return harvestDate; }
    public void setHarvestDate(Date harvestDate) { this.harvestDate = harvestDate; }
    public Date getExpirationDate() { return expirationDate; }
    public void setExpirationDate(Date expirationDate) { this.expirationDate = expirationDate; }
    public String getNutritionalInfo() { return nutritionalInfo; }
    public void setNutritionalInfo(String nutritionalInfo) { this.nutritionalInfo = nutritionalInfo; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
}