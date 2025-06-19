package com.spring.controller;

import com.spring.entity.OrderStatuses;
import com.spring.repository.OrderStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/order-statuses")
public class OrderStatusController {

    @Autowired
    private OrderStatusRepository orderStatusRepository;

    @GetMapping
    public ResponseEntity<List<OrderStatuses>> getAllStatuses() {
        return ResponseEntity.ok(orderStatusRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderStatuses> getStatusById(@PathVariable Integer id) {
        Optional<OrderStatuses> status = orderStatusRepository.findById(id);
        return status.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<OrderStatuses> createStatus(@RequestBody OrderStatuses status) {
        OrderStatuses saved = orderStatusRepository.save(status);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderStatuses> updateStatus(@PathVariable Integer id, @RequestBody OrderStatuses status) {
        if (!orderStatusRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        status.setStatusId(id);
        OrderStatuses updated = orderStatusRepository.save(status);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStatus(@PathVariable Integer id) {
        if (!orderStatusRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        orderStatusRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}