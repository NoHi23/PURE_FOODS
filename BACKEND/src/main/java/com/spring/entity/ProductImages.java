package com.spring.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "ProductImages")
public class ProductImages {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ImageID")
    private int imageId ;

    @Column(name = "ProductID", nullable = true)
    private int productId;

    @Column(name = "ImageURL")
    private String imageUrl;

    @CreationTimestamp
    @jakarta.persistence.Temporal(jakarta.persistence.TemporalType.TIMESTAMP)
    @jakarta.persistence.Column(name = "CreatedAt")
    private java.sql.Timestamp createdAt;

    @Column(name = "Status")
    private int status;

    public ProductImages() {}

    public int getImageId() {
        return imageId;
    }
    public void setImageId(int imageId) {
        this.imageId = imageId;
    }
    public int getProductId() {
        return productId;
    }
    public void setProductId(int productId) {
        this.productId = productId;
    }
    public String getImageUrl() {
        return imageUrl;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
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
