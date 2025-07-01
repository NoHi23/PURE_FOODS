package com.spring.service;


import com.spring.dto.CouponDTO;


import java.util.List;


public interface CouponService {
    CouponDTO createCoupon(CouponDTO couponDTO);
    List<CouponDTO> getAllCoupons();
    CouponDTO getCouponById(Long id);
    CouponDTO updateCoupon(Long id, CouponDTO couponDTO);
    void deleteCoupon(Long id);
    CouponDTO findByCode(String code);
}
