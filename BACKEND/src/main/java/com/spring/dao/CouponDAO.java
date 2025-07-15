package com.spring.dao;

import com.spring.entity.Coupon;

import java.util.List;

public interface CouponDAO {
    Coupon addCoupon(Coupon coupon);
    Coupon findCouponByCode(String couponCode);
    List<Coupon> getAllCoupons();
    Coupon getCouponById(int id);
    Coupon updateCoupon(Coupon coupon);
    void deleteCoupon(int id);
    int countCoupons();
}