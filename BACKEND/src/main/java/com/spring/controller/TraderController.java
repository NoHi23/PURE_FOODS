package com.spring.controller;

import com.spring.dto.TraderDTO;
import com.spring.dto.TraderTransactionDTO;
import com.spring.service.TraderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trader")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TraderController {
    @Autowired
    private TraderService traderService;

    @GetMapping("/{id}")
    public ResponseEntity<TraderDTO> getTraderById(@PathVariable("id") int id) {
        try {
            TraderDTO traderDTO = traderService.getTraderById(id);
            return ResponseEntity.ok(traderDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/transactions/{traderId}")
    public ResponseEntity<?> getTraderTransactions(@PathVariable("traderId") int traderId) {
        try {
            List<TraderTransactionDTO> transactions = traderService.getTraderTransactions(traderId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Get trader transactions successfully!");
            response.put("status", 200);
            response.put("transactions", transactions);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/import")
    public ResponseEntity<String> recordTraderImport(
            @RequestParam int traderId,
            @RequestParam int supplierId,
            @RequestParam int productId,
            @RequestParam int quantity) {
        try {
            traderService.recordTraderImport(traderId, supplierId, productId, quantity);
            return ResponseEntity.ok("Import transaction recorded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/sale")
    public ResponseEntity<String> recordTraderSale(
            @RequestParam int traderId,
            @RequestParam int productId,
            @RequestParam int quantity,
            @RequestParam String orderId) {
        try {
            traderService.recordTraderSale(traderId, productId, quantity, orderId);
            return ResponseEntity.ok("Sale transaction recorded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
