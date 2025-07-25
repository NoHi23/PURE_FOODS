package com.spring.service;

import com.spring.dto.ReviewDTO;
import java.util.List;

public interface ReviewService {
    ReviewDTO createReview(ReviewDTO dto);
    ReviewDTO updateReview(ReviewDTO dto);
    void deleteReview(int productId, int customerId);
    List<ReviewDTO> getReviewsByProduct(int productId);
    // ReviewService.java
    List<ReviewDTO> getAllReviews(); // Lấy tất cả đánh giá (kể cả status = 0)
    void updateReviewStatus(int reviewId, int status); // Admin bật/tắt hiển thị review
    void deleteReviewById(int reviewId);

    Double getAverageRatingByProduct(int productId);
    List<ReviewDTO> getAverageRatingOfAllProducts(); // Sử dụng lại DTO cho đơn giản
    List<ReviewDTO> getAverageRatingByProduct();
    List<ReviewDTO> getReviewsByStatus(int status);

}
