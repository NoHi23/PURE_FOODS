package com.spring.entity;


import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "WishList")
public class Wishlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "WishlistID")
    private int wishlistId;

    @Column(name = "UserID")
    private int userId;

    @Column(name = "ProductID")
    private int productId;

    @CreationTimestamp
    @jakarta.persistence.Temporal(jakarta.persistence.TemporalType.TIMESTAMP)
    @jakarta.persistence.Column(name = "CreatedAt")
    private java.sql.Timestamp createdAt;

    public Wishlist() {}

    public int getWishlistId() {
        return wishlistId;
    }
    public void setWishlistId(int wishlistId) {
        this.wishlistId = wishlistId;
    }
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
    public int getProductId() {
        return productId;
    }
    public void setProductId(int productId) {
        this.productId = productId;
    }
    public java.sql.Timestamp getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(java.sql.Timestamp createdAt) {
        this.createdAt = createdAt;
    }


}
