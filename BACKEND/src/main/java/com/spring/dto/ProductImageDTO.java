package com.spring.dto;


public class ProductImageDTO {

    private int imageId ;

    private int productId;

    private String imageUrl;

    private java.sql.Timestamp createdAt;

    private int status;

    public ProductImageDTO() {};

    public ProductImageDTO(int imageId, int productId, String imageUrl, java.sql.Timestamp createdAt, int status) {
        this.imageId = imageId;
        this.productId = productId;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.status = status;
    }
    public int getProductId() {
        return productId;
    }
    public void setProductId(int productId) {
        this.productId = productId;
    }
    public int getImageId() {
        return imageId;
    }
    public void setImageId(int imageId) {
        this.imageId = imageId;
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
