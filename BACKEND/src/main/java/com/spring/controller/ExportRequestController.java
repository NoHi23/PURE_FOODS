package com.spring.controller;

import com.spring.entity.Orders;
import com.spring.entity.OrderDetails;
import com.spring.service.ExportRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/export-requests")
public class ExportRequestController {

    @Autowired
    private ExportRequestService exportRequestService;

//    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @PostMapping
    public ResponseEntity<Orders> createExportRequest(@RequestBody Orders order, @RequestBody List<OrderDetails> orderDetails) {
        Orders savedOrder = exportRequestService.createExportRequest(order, orderDetails);
        return ResponseEntity.ok(savedOrder);
    }

//    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @GetMapping
    public ResponseEntity<List<Orders>> getAllExportRequests(
            @RequestParam(required = false) String status) {
        List<Orders> requests = exportRequestService.getAllExportRequests(status);
        return ResponseEntity.ok(requests);
    }

//    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @GetMapping("/{id}")
    public ResponseEntity<Orders> getExportRequestById(@PathVariable Integer id) {
        Orders request = exportRequestService.getExportRequestById(id);
       if (request != null) {
            return ResponseEntity.ok(request);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

//    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Orders> cancelExportRequest(@PathVariable Integer id, @RequestParam String cancelReason) {
        Orders updatedOrder = exportRequestService.cancelExportRequest(id, cancelReason);
        if (updatedOrder != null) {
            return ResponseEntity.ok(updatedOrder);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

//    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @PostMapping("/receive")
    public ResponseEntity<Orders> receiveExportRequest(@RequestBody Orders order) {
        Orders receivedOrder = exportRequestService.receiveExportRequest(order);
        return ResponseEntity.ok(receivedOrder);
    }
}