package com.spring.service.Impl;

import com.spring.dao.ProductImageDAO;
import com.spring.dto.ProductImageDTO;
import com.spring.entity.ProductImages;
import com.spring.service.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(propagation = Propagation.REQUIRED)
public class ProductImageServiceImpl implements ProductImageService {

    @Autowired
    private ProductImageDAO productImageDAO;



    @Override
    public List<ProductImageDTO> getAllImagesByProductId(int productId) {
        List<ProductImages> images = productImageDAO.findByProductId(productId);
        return images.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ProductImageDTO convertToDTO(ProductImages productImage) {
        return new ProductImageDTO(
               productImage.getImageId(),
                productImage.getProductId(),
                productImage.getImageUrl(),
                productImage.getCreatedAt(),
                productImage.getStatus()
        );
    }


}
