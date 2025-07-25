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
    @GetMapping("/getAll")
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

    // CREATE
    @PostMapping("/create")
    public ResponseEntity<SuppliersDTO> createSupplier(@RequestBody SuppliersDTO dto) {
        SuppliersDTO created = suppliersService.createSupplier(dto);
        return ResponseEntity.ok(created);
    }

    // UPDATE
    @PutMapping("/update/{id}")
    public ResponseEntity<SuppliersDTO> updateSupplier(@PathVariable("id") int id,
                                                       @RequestBody SuppliersDTO dto) {
        try {
            SuppliersDTO updated = suppliersService.updateSupplier(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable("id") int id) {
        try {
            suppliersService.deleteSupplier(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> countSuppliers() {
        try {
            int count = suppliersService.countSupplier();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Lấy danh sách các nhà cung cấp thành công!");
            response.put("status", 200);
            response.put("countSupplier", count);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}
