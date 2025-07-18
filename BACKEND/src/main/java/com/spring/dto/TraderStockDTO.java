package com.spring.dto;

public class TraderStockDTO {
    private int traderProductId;
    private String productName;
    private int currentStockQuantity;

    // Constructors
    public TraderStockDTO() {}

    public TraderStockDTO(int traderProductId, String productName, int currentStockQuantity) {
        this.traderProductId = traderProductId;
        this.productName = productName;
        this.currentStockQuantity = currentStockQuantity;
    }

    // Getters and Setters
    public int getTraderProductId() { return traderProductId; }
    public void setTraderProductId(int traderProductId) { this.traderProductId = traderProductId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public int getCurrentStockQuantity() { return currentStockQuantity; }
    public void setCurrentStockQuantity(int currentStockQuantity) { this.currentStockQuantity = currentStockQuantity; }
}