package com.spring.controller;

import com.spring.entity.OrderDetail;
import com.spring.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OrderDetailController {

    @Autowired
    private OrderDetailService orderDetailService;

    @PostMapping("/create")
    public ResponseEntity<OrderDetail> createOrderDetail(@RequestBody OrderDetail orderDetail) {
        OrderDetail created = orderDetailService.createOrderDetail(orderDetail);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderDetail>> getByOrderID(@PathVariable("orderId") int orderId) {
        List<OrderDetail> details = orderDetailService.getByOrderID(orderId);
        if (details.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(details);
    }
}