package com.spring.service.Impl;

import com.spring.dao.CouponDAO;
import com.spring.dto.CouponDTO;
import com.spring.entity.Coupon;
import com.spring.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional(propagation = Propagation.REQUIRED)
public class CouponServiceImpl implements CouponService {
    @Autowired
    private CouponDAO couponDAO;

    @Override
    public CouponDTO addCoupon(CouponDTO couponDTO) {
        Coupon coupon = new Coupon();
        coupon.setCouponCode(couponDTO.getCouponCode());
        coupon.setDescription(couponDTO.getDescription());
        coupon.setDiscountType(couponDTO.getDiscountType());
        coupon.setDiscountValue(couponDTO.getDiscountValue());
        coupon.setStartDate(couponDTO.getStartDate());
        coupon.setEndDate(couponDTO.getEndDate());
        coupon.setMinOrderAmount(couponDTO.getMinOrderAmount());
        coupon.setCreatedAt(new Timestamp(new Date().getTime()));
        coupon.setStatus(couponDTO.getStatus());
        couponDAO.addCoupon(coupon);
        return convertToDTO(coupon);
    }

    @Override
    public CouponDTO findByCode(String couponCode) {
        Coupon coupon = couponDAO.findCouponByCode(couponCode);
        if (coupon == null) {
            throw new RuntimeException("Coupon not found");
        }
        return convertToDTO(coupon);
    }

    @Override
    public List<CouponDTO> getAllCoupons() {
        List<Coupon> couponList = couponDAO.getAllCoupons();
        if (couponList == null) {
            throw new RuntimeException("No coupons found!");
        }
        List<CouponDTO> couponDTOList = new ArrayList<>();
        for (Coupon coupon : couponList) {
            couponDTOList.add(convertToDTO(coupon));
        }
        return couponDTOList;
    }

    @Override
    public CouponDTO updateCoupon(CouponDTO couponDTO) {
        Coupon coupon = couponDAO.getCouponById(couponDTO.getCouponId());
        if (coupon == null) {
            throw new RuntimeException("Coupon not found!");
        }
        Coupon existingCoupon = couponDAO.findCouponByCode(couponDTO.getCouponCode());
        if (existingCoupon != null && existingCoupon.getCouponId() != coupon.getCouponId()) {
            throw new RuntimeException("Coupon code already exists!");
        }
        coupon.setCouponCode(couponDTO.getCouponCode());
        coupon.setDescription(couponDTO.getDescription());
        coupon.setDiscountType(couponDTO.getDiscountType());
        coupon.setDiscountValue(couponDTO.getDiscountValue());
        coupon.setStartDate(couponDTO.getStartDate());
        coupon.setEndDate(couponDTO.getEndDate());
        coupon.setMinOrderAmount(couponDTO.getMinOrderAmount());
        coupon.setStatus(couponDTO.getStatus());
        couponDAO.updateCoupon(coupon);
        return convertToDTO(coupon);
    }

    @Override
    public CouponDTO deleteCoupon(int couponId) {
        Coupon coupon = couponDAO.getCouponById(couponId);
        if (coupon == null) {
            throw new RuntimeException("Coupon not found!");
        }
        coupon.setStatus(1);
        couponDAO.updateCoupon(coupon);
        return convertToDTO(coupon);
    }

    @Override
    public int getTotalCoupons() {
        return couponDAO.countCoupons();
    }

    private CouponDTO convertToDTO(Coupon coupon) {
        return new CouponDTO(
                coupon.getCouponId(),
                coupon.getCouponCode(),
                coupon.getDescription(),
                coupon.getDiscountType(),
                coupon.getDiscountValue(),
                coupon.getStartDate(),
                coupon.getEndDate(),
                coupon.getMinOrderAmount(),
                coupon.getCreatedAt(),
                coupon.getStatus()
        );
    }
}