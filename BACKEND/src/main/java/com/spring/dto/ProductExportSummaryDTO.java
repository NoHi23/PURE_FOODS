package com.spring.dto;

public class ProductExportSummaryDTO {
    private int productId;
    private String productName;
    private int totalExported;

    public ProductExportSummaryDTO(int productId, String productName, int totalExported) {
        this.productId = productId;
        this.productName = productName;
        this.totalExported = totalExported;
    }

    public int getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public int getTotalExported() {
        return totalExported;
    }
}
