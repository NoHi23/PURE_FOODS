package com.spring.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;


@Entity
@Table(name = "Products")
public class Products {
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

    @Column(name = "DiscountPercent")
    private Float discountPercent;

    @Column(name = "StockQuantity")
    private int stockQuantity;

    @Column(name = "Description" , nullable = true)
    private String description;

    @Column(name = "ImageURL", nullable = true)
    private String imageURL;

    @Column(name = "LastUpdatedBy")
    private int lastUpdatedBy;

    @CreationTimestamp
    @jakarta.persistence.Temporal(jakarta.persistence.TemporalType.TIMESTAMP)
    @jakarta.persistence.Column(name = "CreatedAt")
    private java.sql.Timestamp createdAt;

    @Column(name = "Status")
    private int status;

    public Products() {}

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
    public Float getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(Float discountPercent) { this.discountPercent = discountPercent; }
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
    public void setLastUpdateBy(int lastUpdatedBy) {
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

    @Transient
    public float getPriceAfterDiscount() {
        if (discountPercent != null && discountPercent > 0) {
            return price * (1 - discountPercent / 100);
        }
        return price;
    }

}
