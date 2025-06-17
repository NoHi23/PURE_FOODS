package com.spring.dto;

import jakarta.persistence.Column;

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
    private int lastUpdatedBy;
    private java.sql.Timestamp createdAt;
    private int status;

    public ProductDTO() {}

    public ProductDTO(int productId, String productName) {
        this.productId = productId;
        this.productName = productName;
    }

    public ProductDTO(int productId, String productName, int categoryId, int supplierId, float price, int stockQuantity, String description, String imageURL, int lastUpdatedBy, java.sql.Timestamp createdAt, int status) {
        this.productId = productId;
        this.productName = productName;
        this.categoryId = categoryId;
        this.supplierId = supplierId;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.description = description;
        this.imageURL = imageURL;
        this.lastUpdatedBy = lastUpdatedBy;
        this.createdAt = createdAt;
        this.status = status;
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
    public int getLastUpdatedBy() {
        return lastUpdatedBy;
    }
    public void setLastUpdatedBy(int lastUpdatedBy) {
        this.lastUpdatedBy = lastUpdatedBy;
    }
    public java.sql.Timestamp getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(java.sql.Timestamp createdAt) {
        this.createdAt = createdAt;
    }
    public int getStatus() {
        return status;
    }
    public void setStatus(int status) {
        this.status = status;
    }

}
