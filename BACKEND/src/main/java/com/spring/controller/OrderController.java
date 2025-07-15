package com.spring.controller;
import com.spring.dto.OrderDTO;
import com.spring.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderDTO orderDTO) {
        try {
            OrderDTO newOrder = orderService.createOrder(orderDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order created successfully!");
            response.put("orderId", newOrder.getOrderId());
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable int id) {
        try {
            OrderDTO order = orderService.getOrderById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order retrieved successfully!");
            response.put("status", 200);
            response.put("order", order);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 404);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
    @GetMapping("/{id}/tracking")
    public ResponseEntity<?> getOrderTracking(@PathVariable int id) {
        try {
            OrderDTO order = orderService.getOrderById(id); // Giả sử tracking lấy từ order
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order tracking retrieved successfully!");
            response.put("status", 200);
            response.put("order", order);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 404);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllOrders() {
        try {
            List<OrderDTO> orders = orderService.getAllOrders();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Orders retrieved successfully!");
            response.put("status", 200);
            response.put("orders", orders);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateOrder(@RequestBody OrderDTO orderDTO) {
        try {
            OrderDTO updatedOrder = orderService.updateOrder(orderDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order updated successfully!");
            response.put("status", 200);
            response.put("order", updatedOrder);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable int id) {
        try {
            orderService.deleteOrder(id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order deleted successfully!");
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 404);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> getTotalOrders() {
        try {
            int totalOrders = orderService.getTotalOrders();
            Map<String, Object> response = new HashMap<>();
            response.put("totalOrders", totalOrders);
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}