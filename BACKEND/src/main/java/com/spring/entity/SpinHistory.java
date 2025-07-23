package com.spring.entity;

import jakarta.persistence.*;

import jakarta.persistence.Entity;
import java.time.LocalDate;

@Entity
@Table(name = "SpinHistory", uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "spinDate"}))
public class SpinHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int userId;

    private LocalDate spinDate;

    private String promotionCode;

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
