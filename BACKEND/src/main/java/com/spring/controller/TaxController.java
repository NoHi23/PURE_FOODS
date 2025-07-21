package com.spring.controller;

import com.spring.dto.TaxDTO;
import com.spring.service.TaxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tax")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TaxController {
    @Autowired
    private TaxService taxService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getTaxById(@PathVariable("id") int id) {
        try {
            TaxDTO taxDTO = taxService.getTaxById(id);
            return ResponseEntity.ok(Map.of("tax", taxDTO, "status", 200));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Tax not found", "status", 404));
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllTaxes() {
        try {
            List<TaxDTO> taxes = taxService.getAllTaxes();
            return ResponseEntity.ok(Map.of("taxList", taxes, "status", 200));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching taxes", "status", 500));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createTax(@RequestBody TaxDTO taxDTO) {
        try {
            TaxDTO createdTax = taxService.createTax(taxDTO);
            return ResponseEntity.ok(Map.of("message", "Thêm thuế thành công!", "tax", createdTax, "status", 200));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage(), "status", 400));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTax(@PathVariable("id") int id, @RequestBody TaxDTO taxDTO) {
        try {
            TaxDTO updatedTax = taxService.updateTax(id, taxDTO);
            return ResponseEntity.ok(Map.of("message", "Cập nhật thuế thành công!", "tax", updatedTax, "status", 200));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Tax not found", "status", 404));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTax(@PathVariable("id") int id) {
        try {
            taxService.deleteTax(id);
            return ResponseEntity.ok(Map.of("message", "Xóa thuế thành công!", "status", 200));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Tax not found", "status", 404));
        }
    }
}