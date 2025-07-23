package com.spring.controller;
import com.spring.entity.OrderStatus;
import com.spring.service.OrderStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/order-statuses")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OrderStatusController {

    @Autowired
    private OrderStatusService orderStatusService;

    @GetMapping
    public List<OrderStatus> getAll() {
        return orderStatusService.findAll();
    }

    @GetMapping("/{id}")
    public OrderStatus getById(@PathVariable Integer id) {
        return orderStatusService.findById(id);
    }
}