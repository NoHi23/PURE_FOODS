package com.spring.dto;

public class TraderStockDTO {
    private int traderProductId;
    private String productName;
    private int currentStockQuantity;
    private String imageURL;
    private double price; // Thêm price
    private int status;   // Thêm status

    // Constructors
    public TraderStockDTO() {}

    public TraderStockDTO(int traderProductId, String productName, int currentStockQuantity, String imageURL) {
        this.traderProductId = traderProductId;
        this.productName = productName;
        this.currentStockQuantity = currentStockQuantity;
        this.imageURL = imageURL;
    }

    public TraderStockDTO(int traderProductId, String productName, int currentStockQuantity, String imageURL, double price) {
        this.traderProductId = traderProductId;
        this.productName = productName;
        this.currentStockQuantity = currentStockQuantity;
        this.imageURL = imageURL;
        this.price = price;
    }

    public TraderStockDTO(int traderProductId, String productName, int currentStockQuantity, String imageURL, double price, int status) {
        this.traderProductId = traderProductId;
        this.productName = productName;
        this.currentStockQuantity = currentStockQuantity;
        this.imageURL = imageURL;
        this.price = price;
        this.status = status;
    }

    // Getters and Setters
    public int getTraderProductId() {
        return traderProductId;
    }

    public void setTraderProductId(int traderProductId) {
        this.traderProductId = traderProductId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getCurrentStockQuantity() {
        return currentStockQuantity;
    }

    public void setCurrentStockQuantity(int currentStockQuantity) {
        this.currentStockQuantity = currentStockQuantity;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}