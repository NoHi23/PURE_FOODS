package com.spring.controller;

import com.spring.dto.CouponDTO;
import com.spring.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CouponController {
    @Autowired
    private CouponService couponService;

    @PostMapping("/add")
    public ResponseEntity<?> addCoupon(@RequestBody CouponDTO couponDTO) {
        try {
            CouponDTO newCoupon = couponService.addCoupon(couponDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Coupon added successfully!");
            response.put("status", 200);
            response.put("coupon", newCoupon);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllCoupons() {
        try {
            List<CouponDTO> couponDTOList = couponService.getAllCoupons();
            Map<String, Object> response = new HashMap<>();
            response.put("couponList", couponDTOList);
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> getTotalCoupons() {
        try {
            int totalCoupons = couponService.getTotalCoupons();
            Map<String, Object> response = new HashMap<>();
            response.put("totalCoupons", totalCoupons);
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCoupon(@RequestBody CouponDTO couponDTO) {
        try {
            CouponDTO updatedCoupon = couponService.updateCoupon(couponDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Coupon updated successfully!");
            response.put("status", 200);
            response.put("coupon", updatedCoupon);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PutMapping("/delete")
    public ResponseEntity<?> deleteCoupon(@RequestBody CouponDTO couponDTO) {
        try {
            CouponDTO deletedCoupon = couponService.deleteCoupon(couponDTO.getCouponId());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Coupon deleted successfully!");
            response.put("status", 200);
            response.put("coupon", deletedCoupon);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/findByCode")
    public ResponseEntity<?> findCouponByCode(@RequestBody Map<String, String> payload) {
        String couponCode = payload.get("couponCode");
        try {
            CouponDTO coupon = couponService.findByCode(couponCode);
            if (coupon != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Coupon found!");
                response.put("status", 200);
                response.put("coupon", coupon);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "Coupon not found!");
                errorResponse.put("status", 404);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}