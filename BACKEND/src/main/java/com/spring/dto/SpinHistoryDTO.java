package com.spring.dto;

import java.time.LocalDate;

public class SpinHistoryDTO {
    private int id;

    private int userId;

    private LocalDate spinDate;

    private String promotionCode;


    public SpinHistoryDTO(){};
    public SpinHistoryDTO(int id, int userId, LocalDate spinDate, String promotionCode) {
        this.id = id;
        this.userId = userId;
        this.spinDate = spinDate;
        this.promotionCode = promotionCode;
    }
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public int getUserId() {
        return userId;
    }
    public void setUserId(int userId) {
        this.userId = userId;
    }
    public LocalDate getSpinDate() {
        return spinDate;
    }
    public void setSpinDate(LocalDate spinDate) {
        this.spinDate = spinDate;
    }
    public String getPromotionCode() {
        return promotionCode;
    }
    public void setPromotionCode(String promotionCode) {
        this.promotionCode = promotionCode;
    }

}
