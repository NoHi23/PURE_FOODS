package com.spring.dao;

import com.spring.entity.Review;
import java.util.List;

public interface ReviewDAO {
    boolean existsByProductIdAndCustomerId(int productId, int customerId);

    Review findByProductAndCustomer(int productId, int customerId);

    Review saveReview(Review review);

    void deleteByProductAndCustomer(int productId, int customerId);

    List<Review> findByProductIdAndStatus(int productId, int status);

    List<Review> findAll();

    Review findById(int id);

    void deleteById(int id);
    Double getAverageRatingByProductId(int productId);
    List<Object[]> getAverageRatingsForAllProducts();
    List<Object[]> findAverageRatingByProduct();
    List<Review> findByStatus(int status);

}
