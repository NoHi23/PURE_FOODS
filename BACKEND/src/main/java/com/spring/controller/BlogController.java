package com.spring.controller;

import com.spring.dto.BlogDTO;
import com.spring.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blog")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BlogController {
    @Autowired
    private BlogService blogService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getBlogById(@PathVariable("id") int id) {
        try {
            BlogDTO blogDTO = blogService.getBlogById(id);
            return ResponseEntity.ok(Map.of("blog", blogDTO, "status", 200));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Blog not found", "status", 404));
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllBlogs() {
        try {
            List<BlogDTO> blogs = blogService.getAllBlogs();
            return ResponseEntity.ok(Map.of("blogList", blogs, "status", 200));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching blogs", "status", 500));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBlog(@RequestBody BlogDTO blogDTO) {
        try {
            BlogDTO createdBlog = blogService.createBlog(blogDTO);
            return ResponseEntity.ok(Map.of("message", "Thêm bài viết thành công!", "blog", createdBlog, "status", 200));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage(), "status", 400));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateBlog(@PathVariable("id") int id, @RequestBody BlogDTO blogDTO) {
        try {
            BlogDTO updatedBlog = blogService.updateBlog(id, blogDTO);
            return ResponseEntity.ok(Map.of("message", "Cập nhật bài viết thành công!", "blog", updatedBlog, "status", 200));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Blog not found", "status", 404));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBlog(@PathVariable("id") int id) {
        try {
            blogService.deleteBlog(id);
            return ResponseEntity.ok(Map.of("message", "Xóa bài viết thành công!", "status", 200));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Blog not found", "status", 404));
        }
    }
}