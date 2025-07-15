package com.spring.dto;

import java.sql.Timestamp;

public class CouponDTO {
    private int couponId;
    private String couponCode;
    private String description;
    private String discountType;
    private double discountValue;
    private Timestamp startDate;
    private Timestamp endDate;
    private double minOrderAmount;
    private Timestamp createdAt;
    private Integer status;

    public CouponDTO() {}

    public CouponDTO(int couponId, String couponCode, String description, String discountType, double discountValue, Timestamp startDate, Timestamp endDate, double minOrderAmount, Timestamp createdAt, Integer status) {
        this.couponId = couponId;
        this.couponCode = couponCode;
        this.description = description;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.startDate = startDate;
        this.endDate = endDate;
        this.minOrderAmount = minOrderAmount;
        this.createdAt = createdAt;
        this.status = status;
    }

    public int getCouponId() {
        return couponId;
    }
    public void setCouponId(int couponId) {
        this.couponId = couponId;
    }
    public String getCouponCode() {
        return couponCode;
    }
    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
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
    public Timestamp getStartDate() {
        return startDate;
    }
    public void setStartDate(Timestamp startDate) {
        this.startDate = startDate;
    }
    public Timestamp getEndDate() {
        return endDate;
    }
    public void setEndDate(Timestamp endDate) {
        this.endDate = endDate;
    }
    public double getMinOrderAmount() {
        return minOrderAmount;
    }
    public void setMinOrderAmount(double minOrderAmount) {
        this.minOrderAmount = minOrderAmount;
    }
    public Timestamp getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
    public Integer getStatus() {
        return status;
    }
    public void setStatus(Integer status) {
        this.status = status;
    }
}