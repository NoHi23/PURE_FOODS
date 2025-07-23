package com.spring.service;


import com.spring.dto.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface ProductService {

    List<ProductDTO> getAllProduct();
    ProductDTO getProductById(int id);
    ProductDTO addProduct(ProductDTO product);
    ProductDTO updateProduct(ProductDTO product);
    boolean deleteProduct(int id);
    int countProduct();

    ProductDTO importProduct(ProductDTO productDTO);
    ProductDTO updateOrganicStatus(int productId, int organicStatusId);
    List<ProductDTO> getAllProductByStatus(int status);
    List<ProductDTO> getTopDiscountProducts(int limit);

    Page<ProductDTO> searchProducts(String keyword,
                                    Integer categoryId,
                                    Integer supplierId,
                                    Integer minDiscount,
                                    Pageable pageable) ;
    List<ProductDTO> getProductsByCategory(int categoryId);

}