package com.spring.service;

import com.spring.dto.BlogDTO;
import java.util.List;

public interface BlogService {
    BlogDTO getBlogById(int id);
    List<BlogDTO> getAllBlogs();
    BlogDTO createBlog(BlogDTO blogDTO);
    BlogDTO updateBlog(int id, BlogDTO blogDTO);
    void deleteBlog(int id);
}