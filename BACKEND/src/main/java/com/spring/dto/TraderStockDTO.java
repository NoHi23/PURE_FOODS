package com.spring.dto;

public class TraderStockDTO {
    private int productId;
    private String productName;
    private int quantityInStock;

    public TraderStockDTO(int productId, String productName, int quantityInStock) {
        this.productId = productId;
        this.productName = productName;
        this.quantityInStock = quantityInStock;
    }

    public int getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public int getQuantityInStock() {
        return quantityInStock;
    }
}
