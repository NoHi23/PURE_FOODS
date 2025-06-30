package com.spring.controller;

import com.spring.dto.ExporterDTO;
import com.spring.dto.TraderTransactionDTO;
import com.spring.entity.Orders;
import com.spring.service.ExporterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/exporter")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ExporterController {

    @Autowired
    private ExporterService exporterService;

    @GetMapping("/{id}")
    public ResponseEntity<ExporterDTO> getExporterById(@PathVariable("id") int id) {
        try {
            ExporterDTO exporterDTO = exporterService.getExporterById(id);
            return exporterDTO != null ? ResponseEntity.ok(exporterDTO) : ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/order")
    public ResponseEntity<Orders> createOrder(@RequestBody Orders order) {
        try {
            Orders savedOrder = exporterService.createOrder(order);
            return ResponseEntity.ok(savedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/orders/{exporterId}")
    public ResponseEntity<List<Orders>> getOrdersByExporterId(@PathVariable("exporterId") int exporterId,
                                                              @RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "10") int size) {
        try {
            List<Orders> orders = exporterService.getOrdersByExporterId(exporterId, page, size);
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/inventory")
    public ResponseEntity<Void> manageInventory(
            @RequestParam int exporterId,
            @RequestParam int productId,
            @RequestParam int quantity,
            @RequestParam String action) {
        try {
            exporterService.manageInventory(exporterId, productId, quantity, action);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/export-from-inventory")
    public ResponseEntity<Void> exportFromInventory(
            @RequestParam int exporterId,
            @RequestParam int orderId,
            @RequestParam int productId,
            @RequestParam int quantity) {
        try {
            exporterService.exportFromInventory(exporterId, orderId, productId, quantity);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/transactions/{exporterId}")
    public ResponseEntity<List<TraderTransactionDTO>> getTransactions(@PathVariable("exporterId") int exporterId,
                                                                      @RequestParam(defaultValue = "0") int page,
                                                                      @RequestParam(defaultValue = "10") int size) {
        try {
            List<TraderTransactionDTO> transactions = exporterService.getTransactions(exporterId, page, size);
            return ResponseEntity.ok(transactions);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<ExporterDTO> updateProfile(@PathVariable("id") int id, @RequestBody ExporterDTO exporterDTO) {
        try {
            ExporterDTO updatedExporter = exporterService.updateProfile(id, exporterDTO);
            return updatedExporter != null ? ResponseEntity.ok(updatedExporter) : ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Orders>> searchOrders(@RequestParam String keyword,
                                                     @RequestParam(defaultValue = "0") int page,
                                                     @RequestParam(defaultValue = "10") int size) {
        try {
            List<Orders> orders = exporterService.searchOrders(keyword, page, size);
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}