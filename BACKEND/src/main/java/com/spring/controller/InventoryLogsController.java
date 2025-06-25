package com.spring.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

    // Đổi /import thành /confirm-order
    @PostMapping("/confirm-order")
    public ResponseEntity<?> confirmOrder(@RequestBody InventoryLogsDTO orderDTO) {
        try {
            InventoryLogsDTO confirmedOrder = inventoryLogsService.confirmOrder(orderDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order confirmed successfully!");
            response.put("status", 200);
            response.put("log", confirmedOrder);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody InventoryLogsDTO orderDTO) {
        try {
            InventoryLogsDTO createdOrder = inventoryLogsService.createOrder(orderDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order created successfully!");
            response.put("status", 200);
            response.put("log", createdOrder);
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

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllInventoryLogs() {
        try {
            List<InventoryLogsDTO> list = inventoryLogsService.getAllLogs();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "get all inventory logs successfully!");
            response.put("status", 200);
            response.put("logs", list);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}