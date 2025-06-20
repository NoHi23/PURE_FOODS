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
import java.util.List;
import java.util.stream.Collectors;

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

    @Override
    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryDAO.getAllCategories();
        return categories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDTO createCategory(CategoryDTO dto) {
        Category category = convertToEntity(dto);
        Category created = categoryDAO.createCategory(category);
        return convertToDTO(created);
    }

    @Override
    public CategoryDTO updateCategory(int id, CategoryDTO dto) {
        Category existing = categoryDAO.getCategoryById(id);
        if (existing == null) {
            throw new RuntimeException("Category not found");
        }

        existing.setCategoryName(dto.getCategoryName());
        existing.setCategoryDescription(dto.getCategoryDescription());
        existing.setIsOrganic(dto.getIsOrganic());
        existing.setStatus(dto.getStatus());

        Category updated = categoryDAO.updateCategory(existing);
        return convertToDTO(updated);
    }

    @Override
    public void deleteCategory(int id) {
        categoryDAO.deleteCategory(id);
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

    // Manual mapping: DTO -> Entity
    private Category convertToEntity(CategoryDTO dto) {
        Category category = new Category();
        category.setCategoryID(dto.getCategoryID());
        category.setCategoryName(dto.getCategoryName());
        category.setCategoryDescription(dto.getCategoryDescription());
        category.setIsOrganic(dto.getIsOrganic());
        category.setStatus(dto.getStatus());
        return category;
    }
}
