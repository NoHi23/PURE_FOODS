package com.spring.dao;


import com.spring.entity.Coupon;


import java.util.List;


public interface CouponDAO {
    Coupon addCoupon(Coupon coupon);
    List<Coupon> getAllCoupons();
    Coupon getCouponById(Long id);
    Coupon updateCoupon(Coupon coupon);
    Coupon deleteCoupon(Long id);
    Coupon findByCode(String code);
}
