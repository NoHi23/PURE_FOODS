package com.spring.service.Impl;


import com.spring.dao.CouponDAO;
import com.spring.dto.CouponDTO;
import com.spring.entity.Coupon;
import com.spring.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;


@Service
public class CouponServiceImpl implements CouponService {


    @Autowired
    private CouponDAO couponDAO;




    @Override
    public List<CouponDTO> getAllCoupons() {
        return couponDAO.getAllCoupons()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    @Override
    public CouponDTO createCoupon(CouponDTO couponDTO) {
        Coupon coupon = convertToEntity(couponDTO);
        Coupon saved = couponDAO.addCoupon(coupon);
        return convertToDTO(saved);
    }


    @Override
    public CouponDTO updateCoupon(Long id, CouponDTO couponDTO) {
        Coupon existing = couponDAO.getCouponById(id);
        if (existing == null) {
            throw new IllegalArgumentException("Coupon not found");
        }


        existing.setCode(couponDTO.getCode());
        existing.setDescription(couponDTO.getDescription());
        existing.setDiscountValue(couponDTO.getDiscountValue());
        existing.setStartDate(couponDTO.getStartDate());
        existing.setEndDate(couponDTO.getEndDate());
        existing.setStatus(couponDTO.getStatus());


        Coupon updated = couponDAO.updateCoupon(existing);
        return convertToDTO(updated);
    }


    @Override
    public void deleteCoupon(Long id) {
        couponDAO.deleteCoupon(id);
    }


    @Override
    public CouponDTO getCouponById(Long id) {
        Coupon coupon = couponDAO.getCouponById(id);
        if (coupon == null) throw new IllegalArgumentException("Coupon not found");
        return convertToDTO(coupon);
    }


    @Override
    public CouponDTO findByCode(String code) {
        Coupon coupon = couponDAO.findByCode(code);
        return coupon != null ? convertToDTO(coupon) : null;
    }


    // ======== Manual Mapping Methods =========
    private CouponDTO convertToDTO(Coupon coupon) {
        CouponDTO dto = new CouponDTO();
        dto.setCouponId(coupon.getCouponId());
        dto.setCode(coupon.getCode());
        dto.setDescription(coupon.getDescription());
        dto.setDiscountValue(coupon.getDiscountValue());
        dto.setStartDate(coupon.getStartDate());
        dto.setEndDate(coupon.getEndDate());
        dto.setStatus(coupon.getStatus());
        return dto;
    }


    private Coupon convertToEntity(CouponDTO dto) {
        Coupon coupon = new Coupon();
        coupon.setCouponId(dto.getCouponId());
        coupon.setCode(dto.getCode());
        coupon.setDescription(dto.getDescription());
        coupon.setDiscountValue(dto.getDiscountValue());
        coupon.setStartDate(dto.getStartDate());
        coupon.setEndDate(dto.getEndDate());
        coupon.setStatus(dto.getStatus());
        return coupon;
    }
}
