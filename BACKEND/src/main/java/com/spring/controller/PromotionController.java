package com.spring.controller;

import com.spring.dto.PromotionDTO;
import com.spring.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/promotion")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PromotionController {
    @Autowired
    private PromotionService promotionService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getPromotionById(@PathVariable("id") int id) {
        try {
            PromotionDTO promotionDTO = promotionService.getPromotionById(id);
            return ResponseEntity.ok(Map.of("promotion", promotionDTO, "status", 200));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Promotion not found", "status", 404));
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllPromotions() {
        try {
            List<PromotionDTO> promotions = promotionService.getAllPromotions();
            return ResponseEntity.ok(Map.of("promotionList", promotions, "status", 200));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching promotions", "status", 500));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createPromotion(@RequestBody PromotionDTO promotionDTO) {
        try {
            PromotionDTO createdPromotion = promotionService.createPromotion(promotionDTO);
            return ResponseEntity.ok(Map.of("message", "Thêm mã giảm giá thành công!", "promotion", createdPromotion, "status", 200));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage(), "status", 400));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePromotion(@PathVariable("id") int id, @RequestBody PromotionDTO promotionDTO) {
        try {
            PromotionDTO updatedPromotion = promotionService.updatePromotion(id, promotionDTO);
            return ResponseEntity.ok(Map.of("message", "Cập nhật mã giảm giá thành công!", "promotion", updatedPromotion, "status", 200));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Promotion not found", "status", 404));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePromotion(@PathVariable("id") int id) {
        try {
            promotionService.deletePromotion(id);
            return ResponseEntity.ok(Map.of("message", "Xóa mã giảm giá thành công!", "status", 200));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Promotion not found", "status", 404));
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<?> getPromotionByCouponCode(@PathVariable("code") String code) {
        try {
            PromotionDTO promotionDTO = promotionService.getPromotionByCode(code);
            return ResponseEntity.ok(Map.of("promotion", promotionDTO, "status", 200));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Promotion not found", "status", 404));
        }
    }
    @PostMapping("/spin/{userId}")
    public ResponseEntity<?> spinWheel(@PathVariable("userId") int userId) {
        try {
            Map<String, Object> result = promotionService.spinWheel(userId);
            return ResponseEntity.ok(Map.of(
                    "message", result.get("message"),
                    "promotion", result.get("promotion"),
                    "status", 200
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", e.getMessage(), "status", 403));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi quay vòng", "status", 500));
        }
    }

}