package com.spring.controller;


import com.spring.dto.SuppliersDTO;
import com.spring.service.SuppliersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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

    // GET ALL
    @GetMapping("/getAll")
    public ResponseEntity<List<SuppliersDTO>> getAllSuppliers() {
        List<SuppliersDTO> list = suppliersService.getAllSuppliers();
        return ResponseEntity.ok(list);
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
}
