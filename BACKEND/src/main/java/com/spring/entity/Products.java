package com.spring.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Products", indexes = {
    @Index(name = "idx_product_name", columnList = "ProductName"),
    @Index(name = "idx_category_id", columnList = "CategoryID")
})
public class Products {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ProductID")
    private Integer productId;

    @Column(name = "ProductName", nullable = false)
    private String productName;

    @ManyToOne
    @JoinColumn(name = "CategoryID", referencedColumnName = "CategoryID")
    private Categories category;

    @ManyToOne
    @JoinColumn(name = "SupplierID", referencedColumnName = "SupplierID")
    private Suppliers supplier;

    @Column(name = "Price", nullable = false)
    private Double price;

    @Column(name = "StockQuantity", nullable = false, columnDefinition = "INT CHECK (StockQuantity >= 0)")
    private Integer stockQuantity;

    @Column(name = "Description")
    private String description;

    @Column(name = "ImageURL")
    private String imageURL;

    @ManyToOne
    @JoinColumn(name = "LastUpdatedBy", referencedColumnName = "UserID")
    private User lastUpdatedBy;

    @Column(name = "CreatedAt", nullable = false, updatable = false, columnDefinition = "DATETIME DEFAULT GETDATE()")
    private java.sql.Timestamp createdAt;

    @Column(name = "Status")
    private Integer status;
     @Column(name = "WarningThreshold")
    private Integer warningThreshold;
    // Getters and Setters
    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public Categories getCategory() { return category; }
    public void setCategory(Categories category) { this.category = category; }
    public Suppliers getSupplier() { return supplier; }
    public void setSupplier(Suppliers supplier) { this.supplier = supplier; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageURL() { return imageURL; }
    public void setImageURL(String imageURL) { this.imageURL = imageURL; }
    public User getLastUpdatedBy() { return lastUpdatedBy; }
    public void setLastUpdatedBy(User lastUpdatedBy) { this.lastUpdatedBy = lastUpdatedBy; }
    public java.sql.Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.sql.Timestamp createdAt) { this.createdAt = createdAt; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
     public Integer getWarningThreshold() { return warningThreshold; }
    public void setWarningThreshold(Integer warningThreshold) { this.warningThreshold = warningThreshold; }

}