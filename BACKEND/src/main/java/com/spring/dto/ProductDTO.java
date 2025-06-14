package com.spring.dto;

import java.util.Date;

public class ProductDTO {
    private int productId;
    private String productName;
    private int categoryId;
    private int supplierId;
    private float price;
    private int stockQuantity;
    private String description;
    private String imageURL;
    private Date harvestDate;
    private Date expirationDate;
    private String nutritionalInfo;
    private String organicStatus;
    private int lastUpdateBy;
    private java.sql.Timestamp createdAt;

    public ProductDTO() {}

    public ProductDTO(int productId, String productName) {
        this.productId = productId;
        this.productName = productName;
    }

    public ProductDTO(int productId, String productName, int categoryId, int supplierId, float price, int stockQuantity, String description, String ImageURL, Date harvestDate, Date expirationDate, String nutritionalInfo, String organicStatus, int lastUpdateBy,java.sql.Timestamp createdAt) {
        this.productId = productId;
        this.productName = productName;
        this.categoryId = categoryId;
        this.supplierId = supplierId;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.description = description;
        this.imageURL = ImageURL;
        this.harvestDate = harvestDate;
        this.expirationDate = expirationDate;
        this.nutritionalInfo = nutritionalInfo;
        this.organicStatus = organicStatus;
        this.lastUpdateBy = lastUpdateBy;
        this.createdAt = createdAt;
    }

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
