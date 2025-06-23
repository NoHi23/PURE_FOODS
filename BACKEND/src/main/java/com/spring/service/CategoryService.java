package com.spring.service;

import com.spring.dto.CategoryDTO;
import java.util.List;

public interface CategoryService {

    CategoryDTO getCategoryById(int id);

    // Lấy danh sách tất cả danh mục
    List<CategoryDTO> getAllCategories();

    // Thêm mới danh mục
    CategoryDTO createCategory(CategoryDTO categoryDTO);

    // Cập nhật danh mục theo ID
    CategoryDTO updateCategory(int id, CategoryDTO categoryDTO);

    // Xóa danh mục theo ID
    void deleteCategory(int id);
}
