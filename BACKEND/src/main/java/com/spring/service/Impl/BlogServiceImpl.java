package com.spring.service.Impl;

import com.spring.dao.BlogDAO;
import com.spring.dto.BlogDTO;
import com.spring.entity.Blog;
import com.spring.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(propagation = Propagation.REQUIRED)
public class BlogServiceImpl implements BlogService {
    @Autowired
    private BlogDAO blogDAO;

    @Override
    public BlogDTO getBlogById(int id) {
        Blog blog = blogDAO.getBlogById(id);
        if (blog == null) {
            throw new RuntimeException("Blog not found");
        }
        return convertToDTO(blog);
    }

    @Override
    public List<BlogDTO> getAllBlogs() {
        List<Blog> blogs = blogDAO.getAllBlogs();
        return blogs.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public BlogDTO createBlog(BlogDTO dto) {
        Blog blog = convertToEntity(dto);
        Blog created = blogDAO.createBlog(blog);
        return convertToDTO(created);
    }

    @Override
    public BlogDTO updateBlog(int id, BlogDTO dto) {
        Blog existing = blogDAO.getBlogById(id);
        if (existing == null) {
            throw new RuntimeException("Blog not found");
        }
        existing.setTitle(dto.getTitle());
        existing.setContent(dto.getContent());
        existing.setUserID(dto.getUserID());
        existing.setStatus(dto.getStatus());
        Blog updated = blogDAO.updateBlog(existing);
        return convertToDTO(updated);
    }

    @Override
    public void deleteBlog(int id) {
        blogDAO.deleteBlog(id);
    }

    private BlogDTO convertToDTO(Blog blog) {
        return new BlogDTO(
                blog.getBlogID(),
                blog.getTitle(),
                blog.getContent(),
                blog.getUserID(),
                blog.getCreatedAt(),
                blog.getStatus()
        );
    }

    private Blog convertToEntity(BlogDTO dto) {
        Blog blog = new Blog();
        blog.setBlogID(dto.getBlogID());
        blog.setTitle(dto.getTitle());
        blog.setContent(dto.getContent());
        blog.setUserID(dto.getUserID());
        blog.setCreatedAt(dto.getCreatedAt());
        blog.setStatus(dto.getStatus());
        return blog;
    }
}
