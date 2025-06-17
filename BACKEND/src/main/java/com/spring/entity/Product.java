package com.spring.entity;


import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ProductID")
    private int productId;

    @Column(name = "ProductName" , nullable = false, length = 100)
    private String productName;

    @Column(name = "CategoryID")
    private int categoryId;

    @Column(name = "SupplierID")
    private int supplierId;

    @Column(name = "Price")
    private float price;

    @Column(name = "StockQuantity")
    private int stockQuantity;

    @Column(name = "Description" , nullable = true, length = 5000)
    private String description;

    @Column(name = "ImageURL", nullable = true, length = 255)
    private String imageURL;

    @Column(name = "HarvestDate", nullable = true)
    private Date harvestDate;

    @Column(name = "ExpirationDate", nullable = true)
    private Date expirationDate;

    @Column(name = "NutritionalInfo", nullable = true, length = 50000)
    private String nutritionalInfo;

    @Column(name = "OrganicStatus", nullable = true, length = 50)
    private String organicStatus;

    @Column(name = "LastUpdateBy")
    private int lastUpdateBy;

    @jakarta.persistence.Temporal(jakarta.persistence.TemporalType.TIMESTAMP)
    @jakarta.persistence.Column(name = "CreatedAt")
    private java.sql.Timestamp createdAt;


    public Product() {}

    public int getProductId() {
        return productId;
    }
    public void setProductId(int productId) {
        this.productId = productId;
    }
    public String getProductName() {
        return productName;
    }
    public void setProductName(String productName) {
        this.productName = productName;
    }
    public int getCategoryId() {
        return categoryId;
    }
    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }
    public int getSupplierId() {
        return supplierId;
    }
    public void setSupplierId(int supplierId) {
        this.supplierId = supplierId;
    }
    public float getPrice() {
        return price;
    }
    public void setPrice(float price) {
        this.price = price;
    }
    public int getStockQuantity() {
        return stockQuantity;
    }
    public void setStockQuantity(int stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getImageURL() {
        return imageURL;
    }
    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }
    public Date getHarvestDate() {
        return harvestDate;
    }
    public void setHarvestDate(Date harvestDate) {
        this.harvestDate = harvestDate;
    }
    public Date getExpirationDate() {
        return expirationDate;
    }
    public void setExpirationDate(Date expirationDate) {
        this.expirationDate = expirationDate;
    }
    public String getNutritionalInfo() {
        return nutritionalInfo;
    }
    public void setNutritionalInfo(String nutritionalInfo) {
        this.nutritionalInfo = nutritionalInfo;
    }
    public String getOrganicStatus() {
        return organicStatus;
    }
    public void setOrganicStatus(String organicStatus) {
        this.organicStatus = organicStatus;
    }
    public int getLastUpdateBy() {
        return lastUpdateBy;
    }
    public void setLastUpdateBy(int lastUpdateBy) {
        this.lastUpdateBy = lastUpdateBy;
    }
    public java.sql.Timestamp getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(java.sql.Timestamp createdAt) {
        this.createdAt = createdAt;
    }




}
