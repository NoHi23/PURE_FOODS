package com.spring.service;


import com.spring.dto.ProductDTO;
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

}