package com.spring.controller;

import com.spring.entity.Orders;
import com.spring.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @PutMapping("/prepare/{orderId}")
    public ResponseEntity<Orders> prepareDelivery(@PathVariable Integer orderId) {
        Orders order = deliveryService.prepareDelivery(orderId);
        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @PutMapping("/assign-driver/{orderId}")
    public ResponseEntity<Orders> assignDriver(@PathVariable Integer orderId, @RequestParam Integer driverId) {
        Orders order = deliveryService.assignDriver(orderId, driverId);
        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER', 'DRIVER')")
    @PutMapping("/update-status/{orderId}")
    public ResponseEntity<Orders> updateDeliveryStatus(@PathVariable Integer orderId, @RequestParam String status) {
        Orders order = deliveryService.updateDeliveryStatus(orderId, status);
        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER', 'DRIVER')")
    @PutMapping("/confirm/{orderId}")
    public ResponseEntity<Orders> confirmDelivery(@PathVariable Integer orderId) {
        Orders order = deliveryService.confirmDelivery(orderId);
        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @PostMapping("/notify/{orderId}")
    public ResponseEntity<Void> notifyDelivery(@PathVariable Integer orderId) {
        deliveryService.notifyDelivery(orderId);
        return ResponseEntity.ok().build();
    }
}