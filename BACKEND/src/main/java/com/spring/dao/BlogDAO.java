package com.spring.dao;

import com.spring.entity.Blog;
import java.util.List;

public interface BlogDAO {
    Blog getBlogById(int id);
    List<Blog> getAllBlogs();
    Blog createBlog(Blog blog);
    Blog updateBlog(Blog blog);
    void deleteBlog(int id);
}