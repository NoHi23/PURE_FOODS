package com.spring.dao;

import com.spring.entity.ProductImages;

import java.util.List;

public interface ProductImageDAO {
    void addImage(ProductImages image);
    List<ProductImages> getImagesByProductId(int productId);
    void deleteImagesByProductId(int productId);

}

