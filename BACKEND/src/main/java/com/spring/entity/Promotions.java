package com.spring.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "Promotions")
public class Promotions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PromotionID")
    private int promotionID;

    @Column(name = "PromotionCode", nullable = false, length = 50, unique = true)
    private String promotionCode;

    @Column(name = "Description")
    private String description;

    @Column(name = "DiscountType", nullable = false, length = 50)
    private String discountType;

    @Column(name = "DiscountValue", nullable = false)
    private double discountValue;

    @Column(name = "StartDate", nullable = false)
    private LocalDate startDate;

    @Column(name = "EndDate", nullable = false)
    private LocalDate endDate;

    @Column(name = "MinOrderAmount")
    private double minOrderAmount;

    @Column(name = "Status")
    private int status;

    public Promotions() {}

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
    public LocalDate getStartDate() {
        return startDate;
    }
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    public LocalDate getEndDate() {
        return endDate;
    }
    public void setEndDate(LocalDate endDate) {
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