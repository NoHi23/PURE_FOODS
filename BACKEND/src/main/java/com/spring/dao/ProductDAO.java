package com.spring.dao;

import com.spring.entity.ProductDetails;
import com.spring.entity.Products;
import java.util.List;

public interface ProductDAO   {

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

}
