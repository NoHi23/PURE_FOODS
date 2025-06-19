package com.spring.controller;

import com.spring.entity.Orders;
import com.spring.entity.OrderDetails;
import com.spring.service.ExportRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// DTO để nhận dữ liệu từ client
class ExportRequestDTO {
    public Orders order;
    public List<OrderDetails> orderDetails;
}

@RestController
@RequestMapping("/api/export-requests")
public class ExportRequestController {

    @Autowired
    private ExportRequestService exportRequestService;

    @PostMapping
    public ResponseEntity<Orders> createExportRequest(@RequestBody ExportRequestDTO request) {
        Orders savedOrder = exportRequestService.createExportRequest(request.order, request.orderDetails);
        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping
    public ResponseEntity<List<Orders>> getAllExportRequests(
            @RequestParam(value = "status", required = false) String status) {
        List<Orders> requests = exportRequestService.getAllExportRequests(status);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orders> getExportRequestById(@PathVariable("id") Integer id) {
        Orders request = exportRequestService.getExportRequestById(id);
        if (request != null) {
            return ResponseEntity.ok(request);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Orders> cancelExportRequest(
            @PathVariable("id") Integer id,
            @RequestParam("cancelReason") String cancelReason) {
        Orders updatedOrder = exportRequestService.cancelExportRequest(id, cancelReason);
        if (updatedOrder != null) {
            return ResponseEntity.ok(updatedOrder);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/receive")
    public ResponseEntity<Orders> receiveExportRequest(@RequestBody Orders order) {
        Orders receivedOrder = exportRequestService.receiveExportRequest(order);
        return ResponseEntity.ok(receivedOrder);
    }
}