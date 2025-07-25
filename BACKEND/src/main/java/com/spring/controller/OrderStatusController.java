package com.spring.controller;


import com.spring.entity.OrderStatus;
import com.spring.service.OrderStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order-status")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OrderStatusController {

    @Autowired
    private OrderStatusService orderStatusService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderStatusById(@PathVariable("id") int id) {
        OrderStatus status = orderStatusService.getOrderStatusById(id);
        if (status == null) {
            return ResponseEntity.status(404).body("Order status not found");
        }
        return ResponseEntity.ok(status);
    }
}
