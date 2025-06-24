package com.spring.controller;

import com.spring.dto.InventoryLogsDTO;
import com.spring.service.InventoryLogsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory-logs")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class InventoryLogsController {

    @Autowired
    private InventoryLogsService inventoryLogsService;

    @PostMapping("/import")
    public ResponseEntity<?> importInventory(@RequestBody InventoryLogsDTO inventoryLogsDTO) {
        try {
            InventoryLogsDTO log = inventoryLogsService.recordImport(inventoryLogsDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Inventory import recorded successfully!");
            response.put("status", 200);
            response.put("log", log);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/{productId}")
    public ResponseEntity<?> getInventoryLogsByProduct(@PathVariable("productId") int productId) {
        try {
            List<InventoryLogsDTO> logs = inventoryLogsService.getLogsByProductId(productId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Get inventory logs successfully!");
            response.put("status", 200);
            response.put("logs", logs);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}