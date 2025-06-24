package com.spring.controller;


import com.spring.dto.CategoryDTO;
import com.spring.dto.SuppliersDTO;
import com.spring.service.SuppliersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/supplier")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SuppliersController {
    @Autowired
    private SuppliersService suppliersService;

    @GetMapping("/{id}")
    public ResponseEntity<SuppliersDTO> getSuppliersById(@PathVariable("id") int id) {
        try {
            SuppliersDTO suppliersDTO = suppliersService.getSuppliersById(id);
            return ResponseEntity.ok(suppliersDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    //Lấy full danh sách nhà cung cấp
    @GetMapping
    public ResponseEntity<?> getAllSuppliers() {
        try {
            List<SuppliersDTO> suppliersList = suppliersService.getAllSuppliers();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Get all suppliers successfully!");
            response.put("status", 200);
            response.put("suppliers", suppliersList);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}
