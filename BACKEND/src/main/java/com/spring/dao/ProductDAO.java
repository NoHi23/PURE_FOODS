package com.spring.dao;

import com.spring.entity.Product;

import java.util.List;

public interface ProductDAO {

    List<Product> getAllProduct();
    Product getProductById(int id);
    Product addProduct(Product product);
    Product updateProduct(Product product);
    void deleteProduct(int id);
    int countProduct();
}
