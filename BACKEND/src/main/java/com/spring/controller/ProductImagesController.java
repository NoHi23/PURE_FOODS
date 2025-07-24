package com.spring.controller;

import com.spring.dto.ProductDTO;
import com.spring.dto.ProductImageDTO;
import com.spring.service.ProductImageService;
import com.spring.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productImage")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProductImagesController {

    @Autowired
    private ProductImageService productImageService;

    @GetMapping("/all/{productId}")
    public ResponseEntity<?> getAllImagesByProductId(@PathVariable("productId") int productId) {
        List<ProductImageDTO> images = productImageService.getAllImagesByProductId(productId);
        return ResponseEntity.ok().body(images);
    }

}
