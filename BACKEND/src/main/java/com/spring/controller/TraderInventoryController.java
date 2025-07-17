package com.spring.controller;

import com.spring.dto.TraderStockDTO;
import com.spring.service.InventoryLogsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/trader/inventory")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TraderInventoryController {

    @Autowired
    private InventoryLogsService inventoryLogsService;

    @GetMapping("/{traderId}")
    public ResponseEntity<?> getCurrentStock(@PathVariable("traderId") int traderId) {
        List<TraderStockDTO> result = inventoryLogsService.getCurrentStockOfTrader(traderId);
        Map<String, Object> res = new HashMap<>();
        res.put("message", "Tồn kho hiện tại của Trader");
        res.put("data", result);
        return ResponseEntity.ok(res);
    }
}
