package com.spring.controller;


import com.spring.dto.CouponDTO;
import com.spring.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.*;


@RestController
@RequestMapping("/api/admin/coupons")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CouponController {


    @Autowired
    private CouponService couponService;


    @PostMapping("/create")
    public ResponseEntity<?> createCoupon(@RequestBody CouponDTO couponDTO) {
        try {
            CouponDTO created = couponService.createCoupon(couponDTO);
            return ResponseEntity.ok(Map.of(
                    "message", "Coupon created successfully!",
                    "status", 200,
                    "coupon", created
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", e.getMessage(),
                    "status", 400
            ));
        }
    }


    @GetMapping("/getAll")
    public ResponseEntity<?> getAllCoupons() {
        try {
            List<CouponDTO> list = couponService.getAllCoupons();
            return ResponseEntity.ok(Map.of(
                    "status", 200,
                    "coupons", list
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", e.getMessage(),
                    "status", 400
            ));
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getCouponById(@PathVariable Long id) {
        try {
            CouponDTO coupon = couponService.getCouponById(id);
            return ResponseEntity.ok(Map.of(
                    "status", 200,
                    "coupon", coupon
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", e.getMessage(),
                    "status", 400
            ));
        }
    }


    @PutMapping("/update")
    public ResponseEntity<?> updateCoupon(@RequestBody CouponDTO couponDTO) {
        try {
            CouponDTO updated = couponService.updateCoupon(couponDTO.getCouponId(), couponDTO);
            return ResponseEntity.ok(Map.of(
                    "message", "Coupon updated successfully!",
                    "status", 200,
                    "coupon", updated
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", e.getMessage(),
                    "status", 400
            ));
        }
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable Long id) {
        try {
            couponService.deleteCoupon(id);
            return ResponseEntity.ok(Map.of(
                    "message", "Coupon deleted successfully!",
                    "status", 200
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", e.getMessage(),
                    "status", 400
            ));
        }
    }


    @GetMapping("/code/{code}")
    public ResponseEntity<?> getCouponByCode(@PathVariable String code) {
        try {
            CouponDTO coupon = couponService.findByCode(code);
            return ResponseEntity.ok(Map.of(
                    "status", 200,
                    "coupon", coupon
            ));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Coupon not found",
                    "status", 404
            ));
        }
    }
}
