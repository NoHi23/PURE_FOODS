package com.spring.service.Impl;

import com.spring.dao.ProductDAO;
import com.spring.dto.ProductDTO;
import com.spring.entity.Product;
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
        List<Product> productList = productDAO.getAllProduct();
        if(productList == null || productList.size() == 0){
            throw new RuntimeException("Product List is empty");
        }
        for(Product product : productList){
            list.add(convertToDTO(product));
        }
        return list;
    }

    @Override
    public ProductDTO getProductById(int id) {
        Product product = productDAO.getProductById(id);
        if(product == null){
            throw new RuntimeException("Product not found");
        }
        return convertToDTO(product);
    }

    @Override
    public ProductDTO addProduct(ProductDTO product) {
        Product q = new Product();
        q.setProductName(product.getProductName());
        productDAO.addProduct(q);
        return convertToDTO(q);
    }

    @Override
    public ProductDTO updateProduct(ProductDTO product) {
        Product q = productDAO.getProductById(product.getProductId());
        if(q == null){
            throw new RuntimeException("Product not found");
        }
        q.setProductName(product.getProductName());
        productDAO.updateProduct(q);
        return convertToDTO(q);
    }

    @Override
    public boolean deleteProduct(int id) {
        Product product = productDAO.getProductById(id);
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

    private ProductDTO convertToDTO(Product product) {
        return new ProductDTO(
                product.getProductId(),
                product.getProductName()
        );
    }

}
