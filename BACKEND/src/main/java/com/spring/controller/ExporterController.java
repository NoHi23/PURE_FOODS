package com.spring.controller;

import com.spring.dto.ExporterDTO;
import com.spring.dto.OrderRequestDTO;
import com.spring.entity.Order;
import com.spring.entity.OrderDetails;
import com.spring.service.ExporterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/exporter")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ExporterController {

    @Autowired
    private ExporterService exporterService;

    @PostMapping("/login")
    public ResponseEntity<ExporterDTO> login(@RequestBody Map<String, String> loginData) {
        try {
            String email = loginData.get("email");
            String password = loginData.get("password");
            if (email == null || password == null) {
                return ResponseEntity.status(400).build();
            }
            ExporterDTO exporter = exporterService.authenticate(email, password);
            if (exporter == null) {
                return ResponseEntity.status(401).build();
            }
            return ResponseEntity.ok(exporter);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExporterDTO> getExporterById(@PathVariable("id") int id) {
        try {
            if (id <= 0) {
                return ResponseEntity.status(400).build();
            }
            ExporterDTO exporterDTO = exporterService.getExporterById(id);
            if (exporterDTO == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(exporterDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/order")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequestDTO orderRequestDTO) {
        try {
            if (orderRequestDTO == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "Order request data is null");
                errorResponse.put("status", 400);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            Order savedOrder = exporterService.createOrder(orderRequestDTO);
            if (savedOrder == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "Failed to create order");
                errorResponse.put("status", 500);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order created successfully!");
            response.put("status", 200);
            response.put("order", savedOrder);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error creating order: " + e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/orders/{exporterId}")
    public ResponseEntity<List<Order>> getOrdersByExporterId(@PathVariable("exporterId") int exporterId,
                                                             @RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size) {
        try {
            if (exporterId <= 0 || page < 0 || size <= 0) {
                return ResponseEntity.status(400).build();
            }
            List<Order> orders = exporterService.getOrdersByExporterId(exporterId, page, size);
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/inventory")
    public ResponseEntity<Void> manageInventory(
            @RequestParam int exporterId,
            @RequestParam int productId,
            @RequestParam int quantity,
            @RequestParam String action) {
        try {
            if (exporterId <= 0 || productId <= 0 || quantity < 0 || action == null || action.isEmpty()) {
                return ResponseEntity.status(400).build();
            }
            exporterService.manageInventory(exporterId, productId, quantity, action);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/export-from-inventory")
    public ResponseEntity<Void> exportFromInventory(
            @RequestParam int exporterId,
            @RequestParam int orderId,
            @RequestParam int productId,
            @RequestParam int quantity) {
        try {
            if (exporterId <= 0 || orderId <= 0 || productId <= 0 || quantity <= 0) {
                return ResponseEntity.status(400).build();
            }
            exporterService.exportFromInventory(exporterId, orderId, productId, quantity);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/transactions/{exporterId}")
    public ResponseEntity<List<OrderDetails>> getTransactions(@PathVariable("exporterId") int exporterId,
                                                              @RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "10") int size) {
        try {
            if (exporterId <= 0 || page < 0 || size <= 0) {
                return ResponseEntity.status(400).build();
            }
            List<OrderDetails> transactions = exporterService.getTransactions(exporterId, page, size);
            return ResponseEntity.ok(transactions);
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<ExporterDTO> updateProfile(@PathVariable("id") int id, @RequestBody ExporterDTO exporterDTO) {
        try {
            if (id <= 0 || exporterDTO == null) {
                return ResponseEntity.status(400).build();
            }
            ExporterDTO updatedExporter = exporterService.updateProfile(id, exporterDTO);
            if (updatedExporter == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedExporter);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Order>> searchOrders(@RequestParam String keyword,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "10") int size) {
        try {
            if (keyword == null || keyword.trim().isEmpty() || page < 0 || size <= 0) {
                return ResponseEntity.status(400).build();
            }
            List<Order> orders = exporterService.searchOrders(keyword, page, size);
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).build();
        }
    }
}