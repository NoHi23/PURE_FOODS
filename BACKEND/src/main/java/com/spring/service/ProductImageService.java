package com.spring.service;

import com.spring.dto.ProductImageDTO;

import java.util.List;

public interface ProductImageService {
    List<ProductImageDTO> getAllImagesByProductId(int productId);

}
