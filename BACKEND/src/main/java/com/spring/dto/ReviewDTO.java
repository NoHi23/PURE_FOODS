package com.spring.dto;

import java.time.LocalDateTime;

public class ReviewDTO {
    private int reviewId;
    private int productId;
    private int customerId;
    private String productName;
    private String customerName;
    private int rating;
    private String comment;
    private int status;
    private LocalDateTime createdAt;

    // Constructors
    public ReviewDTO() {}
    // Constructor dành riêng cho bảng thống kê số sao trung bình theo sản phẩm
    public ReviewDTO(int productId, String productName, int rating) {
        this.productId = productId;
        this.productName = productName;
        this.rating = rating;
    }

    public ReviewDTO(int reviewId, int productId, int customerId, String productName,
                     String customerName, int rating, String comment, int status, LocalDateTime createdAt) {
        this.reviewId = reviewId;
        this.productId = productId;
        this.customerId = customerId;
        this.productName = productName;
        this.customerName = customerName;
        this.rating = rating;
        this.comment = comment;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters & Setters
    public int getReviewId() {
        return reviewId;
    }

    public void setReviewId(int reviewId) {
        this.reviewId = reviewId;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public int getCustomerId() {
        return customerId;
    }

    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
