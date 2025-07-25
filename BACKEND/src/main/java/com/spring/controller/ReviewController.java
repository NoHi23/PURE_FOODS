package com.spring.controller;

import com.spring.dto.ReviewDTO;

import com.spring.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/review")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/create")
    public ResponseEntity<ReviewDTO> create(@RequestBody ReviewDTO dto) {
        return ResponseEntity.ok(reviewService.createReview(dto));
    }

    @PutMapping("/update")
    public ResponseEntity<ReviewDTO> update(@RequestBody ReviewDTO dto) {
        return ResponseEntity.ok(reviewService.updateReview(dto));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> delete(
            @RequestParam("productId") int productId,
            @RequestParam("customerId") int customerId
    ) {
        reviewService.deleteReview(productId, customerId);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/product")
    public ResponseEntity<List<ReviewDTO>> getByProduct(
            @RequestParam("productId") int productId
    ) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }
    // Lấy tất cả đánh giá (kể cả status = 0)
    @GetMapping("/admin/all")
    public ResponseEntity<List<ReviewDTO>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    // Thay đổi trạng thái hiển thị của đánh giá
    @PutMapping("/admin/status")
    public ResponseEntity<Void> updateReviewStatus(
            @RequestParam("reviewId") int reviewId,
            @RequestParam("status") int status
    ) {
        reviewService.updateReviewStatus(reviewId, status);
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/admin/delete")
    public ResponseEntity<Void> deleteReviewAdmin(@RequestParam("reviewId") int reviewId) {
        reviewService.deleteReviewById(reviewId); // ✅ OK rồi
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/average/product")
    public ResponseEntity<Double> getAverageRatingByProduct(@RequestParam(name = "productId") int productId) {
        return ResponseEntity.ok(reviewService.getAverageRatingByProduct(productId));
    }


    @GetMapping("/average/all")
    public ResponseEntity<List<ReviewDTO>> getAverageRatingOfAllProducts() {
        return ResponseEntity.ok(reviewService.getAverageRatingOfAllProducts());
    }
    @GetMapping("/admin/avg-rating")
    public ResponseEntity<List<ReviewDTO>> getAverageRating() {
        return ResponseEntity.ok(reviewService.getAverageRatingByProduct());
    }
    @GetMapping("/admin/filter")
    public ResponseEntity<List<ReviewDTO>> filterByStatus(@RequestParam("status") int status) {
        return ResponseEntity.ok(reviewService.getReviewsByStatus(status));
    }


}
