package com.spring.dao;

import com.spring.entity.ProductDetails;
import com.spring.entity.Products;
import org.springframework.data.domain.*;

import java.util.List;
import java.util.Optional;

public interface ProductDAO {

    List<Products> getAllProduct();

    Products getProductById(int id);

    Products addProduct(Products product);

    Products updateProduct(Products product);

    void deleteProduct(int id);

    int countProduct();

    void addProductDetails(ProductDetails productDetails);

    void updateProductOrganicInfo(int productId, int organicStatusId);

    ProductDetails getProductDetailsById(int productId);

    Products findById(int id);

    Products save(Products product);

    List<Products> getProductByStatus(int status);

    List<Products> getTopDiscountProducts(int limit);

    Page<Products> searchProducts(String keyword,
                                  Integer categoryId,
                                  Integer supplierId,
                                  Integer minDiscount,
                                  Pageable pageable);

}