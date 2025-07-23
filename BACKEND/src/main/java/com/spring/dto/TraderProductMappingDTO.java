package com.spring.dto;

public class TraderProductMappingDTO {
    private int mappingId;
    private int userId;
    private int productId;
    private int traderProductId;

    public int getMappingId() {
        return mappingId;
    }

    public void setMappingId(int mappingId) {
        this.mappingId = mappingId;
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

    public int getTraderProductId() {
        return traderProductId;
    }

    public void setTraderProductId(int traderProductId) {
        this.traderProductId = traderProductId;
    }
}
