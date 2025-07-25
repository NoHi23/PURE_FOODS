package com.spring.service.Impl;

import com.spring.dao.OrderDAO;
import com.spring.dao.ProductDAO;
import com.spring.dao.ReviewDAO;
import com.spring.dao.UserDAO;
import com.spring.dto.ReviewDTO;
import com.spring.entity.Products;
import com.spring.entity.Review;
import com.spring.entity.User;
import com.spring.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewDAO reviewDAO;

    @Autowired
    private ProductDAO productDAO;

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private OrderDAO orderDAO; // ✅ thêm dòng này

    @Override
    public ReviewDTO createReview(ReviewDTO dto) {
        // ✅ Kiểm tra đã mua hàng chưa
        if (!orderDAO.hasCustomerBoughtProduct(dto.getCustomerId(), dto.getProductId())) {
            throw new RuntimeException("Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua và nhận hàng.");
        }

        if (reviewDAO.existsByProductIdAndCustomerId(dto.getProductId(), dto.getCustomerId())) {
            throw new RuntimeException("Bạn đã đánh giá sản phẩm này rồi.");
        }

        Products product = productDAO.getProductById(dto.getProductId());
        User customer = userDAO.getUserById(dto.getCustomerId());

        Review review = new Review();
        review.setProduct(product);
        review.setCustomer(customer);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setStatus(1);

        Review saved = reviewDAO.saveReview(review);
        return convertToDTO(saved);
    }

    @Override
    public ReviewDTO updateReview(ReviewDTO dto) {
        Review review = reviewDAO.findByProductAndCustomer(dto.getProductId(), dto.getCustomerId());
        if (review == null) {
            throw new RuntimeException("Review không tồn tại.");
        }
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        return convertToDTO(reviewDAO.saveReview(review));
    }

    @Override
    public void deleteReview(int productId, int customerId) {
        reviewDAO.deleteByProductAndCustomer(productId, customerId);
    }

    @Override
    public List<ReviewDTO> getReviewsByProduct(int productId) {
        return reviewDAO.findByProductIdAndStatus(productId, 1)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    @Override
    public List<ReviewDTO> getAllReviews() {
        return reviewDAO.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void updateReviewStatus(int reviewId, int status) {
        Review review = reviewDAO.findById(reviewId);
        if (review == null) {
            throw new RuntimeException("Không tìm thấy đánh giá.");
        }
        review.setStatus(status);
        reviewDAO.saveReview(review);
    }
    @Override
    public void deleteReviewById(int reviewId) {
        Review review = reviewDAO.findById(reviewId);
        if (review == null) {
            throw new RuntimeException("Không tìm thấy đánh giá để xoá.");
        }
        reviewDAO.deleteById(reviewId);
    }


    @Override
    public Double getAverageRatingByProduct(int productId) {
        return reviewDAO.getAverageRatingByProductId(productId);
    }

    @Override
    public List<ReviewDTO> getAverageRatingOfAllProducts() {
        List<Object[]> results = reviewDAO.getAverageRatingsForAllProducts();
        return results.stream().map(obj -> {
            int productId = (int) obj[0];
            String productName = (String) obj[1];
            double avgRating = (double) obj[2];
            return new ReviewDTO(productId, productName, (int) Math.round(avgRating));

        }).collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> getAverageRatingByProduct() {
        List<Object[]> results = reviewDAO.findAverageRatingByProduct();
        return results.stream().map(row -> {
            int productId = (int) row[0];
            String productName = (String) row[1];
            double avgRating = (double) row[2];
            return new ReviewDTO(productId, productName, (int) Math.round(avgRating));
        }).collect(Collectors.toList());
    }
    @Override
    public List<ReviewDTO> getReviewsByStatus(int status) {
        return reviewDAO.findByStatus(status)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    private ReviewDTO convertToDTO(Review review) {
        return new ReviewDTO(
                review.getReviewId(),
                review.getProduct().getProductId(),
                review.getCustomer().getUserId(),
                review.getProduct().getProductName(),
                review.getCustomer().getFullName(),
                review.getRating(),
                review.getComment(),
                review.getStatus(),
                review.getCreatedAt()
        );
    }



}
