package com.spring.entity;


import jakarta.persistence.*;
import java.util.Date;


@Entity
@Table(name = "coupons")
public class Coupon {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "coupon_id")
    private Long couponId;


    @Column(name = "code", nullable = false, unique = true)
    private String code;


    @Column(name = "description")
    private String description;


    @Column(name = "discount_value")
    private Double discountValue;


    @Column(name = "start_date")
    @Temporal(TemporalType.DATE)
    private Date startDate;


    @Column(name = "end_date")
    @Temporal(TemporalType.DATE)
    private Date endDate;


    @Column(name = "status")
    private Integer status;


    // ===== Constructors =====


    public Coupon() {}


    public Coupon(Long couponId, String code, String description, Double discountValue,
                  Date startDate, Date endDate, Integer status) {
        this.couponId = couponId;
        this.code = code;
        this.description = description;
        this.discountValue = discountValue;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }


    // ===== Getters and Setters =====


    public Long getCouponId() {
        return couponId;
    }


    public void setCouponId(Long couponId) {
        this.couponId = couponId;
    }


    public String getCode() {
        return code;
    }


    public void setCode(String code) {
        this.code = code;
    }


    public String getDescription() {
        return description;
    }


    public void setDescription(String description) {
        this.description = description;
    }


    public Double getDiscountValue() {
        return discountValue;
    }


    public void setDiscountValue(Double discountValue) {
        this.discountValue = discountValue;
    }


    public Date getStartDate() {
        return startDate;
    }


    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }


    public Date getEndDate() {
        return endDate;
    }


    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }


    public Integer getStatus() {
        return status;
    }


    public void setStatus(Integer status) {
        this.status = status;
    }
}

