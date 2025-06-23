package com.spring.controller;


import com.spring.dto.SuppliersDTO;
import com.spring.service.SuppliersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
