package com.spring.dto;

import java.time.LocalDate;

public class UserPromotionDTO {
    private int id;

    private int userId;

    private String promotionCode;

    private String status;

    private LocalDate assignedDate;

    public UserPromotionDTO() {};

    public UserPromotionDTO(int id, int userId, String promotionCode, String status, LocalDate assignedDate) {
        this.id = id;
        this.userId = userId;
        this.promotionCode = promotionCode;
        this.status = status;
        this.assignedDate = assignedDate;
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
    public String getPromotionCode() {
        return promotionCode;
    }
    public void setPromotionCode(String promotionCode) {
        this.promotionCode = promotionCode;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public LocalDate getAssignedDate() {
        return assignedDate;
    }
    public void setAssignedDate(LocalDate assignedDate) {
        this.assignedDate = assignedDate;
    }

}
