package com.spring.service.Impl;

import com.spring.dao.ProductDAO;
import com.spring.dto.ProductDTO;
import com.spring.entity.Products;
import com.spring.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(propagation = Propagation.REQUIRED)

public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductDAO productDAO;
    @Override
    public List<ProductDTO> getAllProduct() {
        List<ProductDTO> list = new ArrayList<ProductDTO>();
        List<Products> productList = productDAO.getAllProduct();
        if(productList == null || productList.size() == 0){
            throw new RuntimeException("Product List is empty");
        }
        for(Products product : productList){
            list.add(convertToDTO(product));
        }
        return list;
    }

    @Override
    public ProductDTO getProductById(int id) {
        Products product = productDAO.getProductById(id);
        if(product == null){
            throw new RuntimeException("Product not found");
        }
        return convertToDTO(product);
    }

    @Override
    public ProductDTO addProduct(ProductDTO product) {
        Products q = new Products();
        q.setProductName(product.getProductName());
        q.setCategoryId(product.getCategoryId());
        q.setSupplierId(product.getSupplierId());
        q.setPrice(product.getPrice());
        q.setStockQuantity(product.getStockQuantity());
        q.setDescription(product.getDescription());
        q.setImageURL(product.getImageURL());
        q.setLastUpdateBy(1);
        q.setStatus(product.getStatus());
        productDAO.addProduct(q);
        return convertToDTO(q);
    }

    @Override
    public ProductDTO updateProduct(ProductDTO product) {
        Products q = productDAO.getProductById(product.getProductId());
        if(q == null){
            throw new RuntimeException("Product not found");
        }
        q.setProductName(product.getProductName());
        productDAO.updateProduct(q);
        return convertToDTO(q);
    }

    @Override
    public boolean deleteProduct(int id) {
        Products product = productDAO.getProductById(id);
        if(product == null){
            throw new RuntimeException("Product not found");
        }
        productDAO.deleteProduct(product.getProductId());
        return true;
    }

    @Override
    public int countProduct() {
        return productDAO.countProduct();
    }

    private ProductDTO convertToDTO(Products product) {
        return new ProductDTO(
                product.getProductId(),
                product.getProductName(),
                product.getCategoryId(),
                product.getSupplierId(),
                product.getPrice(),
                product.getStockQuantity(),
                product.getDescription(),
                product.getImageURL(),
                product.getLastUpdatedBy(),
                product.getCreatedAt(),
                product.getStatus()
        );
    }

}
