package com.spring.service.Impl;


import com.spring.dao.CategoryDAO;
import com.spring.dto.CategoryDTO;
import com.spring.dto.ProductDTO;
import com.spring.entity.Category;
import com.spring.entity.Products;
import com.spring.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(propagation = Propagation.REQUIRED)

public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryDAO categoryDAO;


    @Override
    public CategoryDTO getCategoryById(int id) {
        Category category = categoryDAO.getCategoryById(id);
        if(category == null){
            throw new RuntimeException("Category not found");
        }
        return convertToDTO(category);
    }

    private CategoryDTO convertToDTO(Category category) {
        return new CategoryDTO(
                category.getCategoryID(),
                category.getCategoryName(),
                category.getCategoryDescription(),
                category.getIsOrganic(),
                category.getStatus()
        );
    }
}
