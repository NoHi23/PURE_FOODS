package com.spring.controller;


import com.spring.dto.ProductDTO;
import com.spring.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllProduct() {
        try {
            List<ProductDTO> list = productService.getAllProduct();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "get all Product successfully!");
            response.put("status", 200);
            response.put("listProduct", list);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@RequestBody ProductDTO productDTO) {
        try {
            System.out.println("PRODUCT NAME: "+productDTO.getProductName());
            ProductDTO p = productService.addProduct(productDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "add Product successfully!");
            response.put("status", 200);
            response.put("product", p);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProduct(@RequestBody ProductDTO productDTO) {
        try {
            ProductDTO p = productService.updateProduct(productDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Update Product successfully!");
            response.put("status", 200);
            response.put("product", p);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteProduct(@RequestBody ProductDTO productDTO) {
        try {
            boolean del = productService.deleteProduct(productDTO.getProductId());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "delete Product successfully!");
            response.put("status", 200);
            response.put("deleteProduct", del);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> countProduct() {
        try {
            int count = productService.countProduct();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "get number of Product successfully!");
            response.put("status", 200);
            response.put("countProduct", count);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    // url: /api/product/import để nhập sản phẩm mới vào kho
    @PostMapping("/import")
    public ResponseEntity<?> importProduct(@RequestBody ProductDTO productDTO) {
        try {
            ProductDTO importedProduct = productService.importProduct(productDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product imported successfully!");
            response.put("status", 200);
            response.put("product", importedProduct);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    // thêm trạng thái hữu cơ (đồ sạch)
    @PostMapping("/organic-status")
    public ResponseEntity<?> updateOrganicStatus(@RequestBody Map<String, Integer> request) {
        try {
            int productId = request.get("productId");
            int organicStatusId = request.get("organicStatusId");
            ProductDTO updatedProduct = productService.updateOrganicStatus(productId, organicStatusId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Organic status updated successfully!");
            response.put("status", 200);
            response.put("product", updatedProduct);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/getAll/status0")
    public ResponseEntity<?> getAllProductStatus0() {
        try {
            List<ProductDTO> list = productService.getAllProductByStatus(0);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Lấy sản phẩm có status = 0 thành công!");
            response.put("status", 200);
            response.put("listProduct", list);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/top-discount")
    public ResponseEntity<List<ProductDTO>> getTopDiscountProducts() {
        return ResponseEntity.ok(productService.getTopDiscountProducts(12));
    }

}
