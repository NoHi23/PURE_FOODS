package com.spring.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ProductDetails")
public class ProductDetails {
    @Id
    @Column(name = "ProductID")
    private Integer productId;

    @Column(name = "HarvestDate")
    private java.sql.Date harvestDate;

    @Column(name = "ExpirationDate")
    private java.sql.Date expirationDate;

    @Column(name = "NutritionalInfo")
    private String nutritionalInfo;

    @Column(name = "Status")
    private Integer status;

    @OneToOne
    @MapsId
    @JoinColumn(name = "ProductID")
    private Products product;

    // Getters and Setters
    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }
    public java.sql.Date getHarvestDate() { return harvestDate; }
    public void setHarvestDate(java.sql.Date harvestDate) { this.harvestDate = harvestDate; }
    public java.sql.Date getExpirationDate() { return expirationDate; }
    public void setExpirationDate(java.sql.Date expirationDate) { this.expirationDate = expirationDate; }
    public String getNutritionalInfo() { return nutritionalInfo; }
    public void setNutritionalInfo(String nutritionalInfo) { this.nutritionalInfo = nutritionalInfo; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public Products getProduct() { return product; }
    public void setProduct(Products product) { this.product = product; }
}