package com.spring.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "CartItems")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CartItemID")
    private Long cartItemID;

    @Column(name = "UserID", nullable = false)
    private Long userID;

    @Column(name = "ProductID", nullable = false)
    private Long productID;

    @Column(name = "Quantity", nullable = false)
    private int quantity;

    @Column(name = "AddedAt", nullable = false)
    private LocalDateTime addedAt;

    @Column(name = "Status", nullable = false, length = 50)
    private String status;

    public CartItem() {}

    public Long getCartItemID() {
        return cartItemID;
    }

    public void setCartItemID(Long cartItemID) {
        this.cartItemID = cartItemID;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public Long getProductID() {
        return productID;
    }

    public void setProductID(Long productID) {
        this.productID = productID;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
