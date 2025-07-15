package com.spring.service;

import com.spring.dto.CouponDTO;
import java.util.List;

public interface CouponService {
    CouponDTO addCoupon(CouponDTO couponDTO);
    CouponDTO findByCode(String couponCode);
    List<CouponDTO> getAllCoupons();
    CouponDTO updateCoupon(CouponDTO couponDTO);
    CouponDTO deleteCoupon(int couponId);
    int getTotalCoupons();
}