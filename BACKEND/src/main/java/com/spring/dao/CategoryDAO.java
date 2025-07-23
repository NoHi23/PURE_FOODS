package com.spring.dao;

import com.spring.entity.Category;
import java.util.List;

public interface CategoryDAO {

    Category getCategoryById(int id);
    List<Category> getAllCategories();
    Category createCategory(Category category);
    Category updateCategory(Category category);
    void deleteCategory(int id);
    Category getCategoryByName(String name);
}
