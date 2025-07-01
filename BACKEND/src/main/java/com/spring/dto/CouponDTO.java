package com.spring.dto;


import java.util.Date;


public class CouponDTO {
    private Long couponId;
    private String code;
    private String description;
    private Double discountValue;
    private Date startDate;
    private Date endDate;
    private Integer status;


    public CouponDTO() {}


    public Long getCouponId() { return couponId; }
    public void setCouponId(Long couponId) { this.couponId = couponId; }


    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }


    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }


    public Double getDiscountValue() { return discountValue; }
    public void setDiscountValue(Double discountValue) { this.discountValue = discountValue; }


    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }


    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }


    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
}
