package com.spring.controller;

import com.spring.dto.TraderDTO;
import com.spring.dto.TraderTransactionDTO;
import com.spring.entity.Orders;
import com.spring.service.TraderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/trader")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TraderController {

    @Autowired
    private TraderService traderService;

    @GetMapping("/{id}")
    public ResponseEntity<TraderDTO> getTraderById(@PathVariable("id") int id) {
        try {
            TraderDTO traderDTO = traderService.getTraderById(id);
            return traderDTO != null ? ResponseEntity.ok(traderDTO) : ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/order")
    public ResponseEntity<Orders> createOrder(@RequestBody Orders order) {
        try {
            Orders savedOrder = traderService.createOrder(order);
            return ResponseEntity.ok(savedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/orders/{traderId}")
    public ResponseEntity<List<Orders>> trackOrders(@PathVariable("traderId") int traderId) {
        try {
            List<Orders> orders = traderService.trackOrders(traderId);
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/inventory")
    public ResponseEntity<Void> manageInventory(
            @RequestParam int traderId,
            @RequestParam int productId,
            @RequestParam int quantity,
            @RequestParam String action) {
        try {
            traderService.manageInventory(traderId, productId, quantity, action);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/import-from-supplier")
    public ResponseEntity<Void> importFromSupplier(
            @RequestParam int traderId,
            @RequestParam int supplierId,
            @RequestParam int productId,
            @RequestParam int quantity) {
        try {
            traderService.importFromSupplier(traderId, supplierId, productId, quantity);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/transactions/{traderId}")
    public ResponseEntity<List<TraderTransactionDTO>> getTransactions(@PathVariable("traderId") int traderId) {
        try {
            List<TraderTransactionDTO> transactions = traderService.getTransactions(traderId);
            return ResponseEntity.ok(transactions);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}