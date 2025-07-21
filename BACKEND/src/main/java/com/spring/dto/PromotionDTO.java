package com.spring.dto;

public class PromotionDTO {
    private int promotionID;
    private String promotionCode;
    private String description;
    private String discountType;
    private double discountValue;
    private String startDate;
    private String endDate;
    private double minOrderAmount;
    private int status;

    public PromotionDTO() {}

    public PromotionDTO(int promotionID, String promotionCode, String description, String discountType,
                        double discountValue, String startDate, String endDate, double minOrderAmount, int status) {
        this.promotionID = promotionID;
        this.promotionCode = promotionCode;
        this.description = description;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.startDate = startDate;
        this.endDate = endDate;
        this.minOrderAmount = minOrderAmount;
        this.status = status;
    }

    public int getPromotionID() {
        return promotionID;
    }
    public void setPromotionID(int promotionID) {
        this.promotionID = promotionID;
    }
    public String getPromotionCode() {
        return promotionCode;
    }
    public void setPromotionCode(String promotionCode) {
        this.promotionCode = promotionCode;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getDiscountType() {
        return discountType;
    }
    public void setDiscountType(String discountType) {
        this.discountType = discountType;
    }
    public double getDiscountValue() {
        return discountValue;
    }
    public void setDiscountValue(double discountValue) {
        this.discountValue = discountValue;
    }
    public String getStartDate() {
        return startDate;
    }
    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }
    public String getEndDate() {
        return endDate;
    }
    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }
    public double getMinOrderAmount() {
        return minOrderAmount;
    }
    public void setMinOrderAmount(double minOrderAmount) {
        this.minOrderAmount = minOrderAmount;
    }
    public int getStatus() {
        return status;
    }
    public void setStatus(int status) {
        this.status = status;
    }
}