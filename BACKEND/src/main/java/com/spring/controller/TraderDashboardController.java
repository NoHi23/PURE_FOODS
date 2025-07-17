package com.spring.controller;

import com.spring.service.InventoryLogsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/trader/dashboard")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TraderDashboardController {

    @Autowired
    private InventoryLogsService inventoryLogsService;

    @GetMapping("/{traderId}")
    public ResponseEntity<?> getDashboard(@PathVariable("traderId") int traderId) {
        Map<String, Object> dashboard = inventoryLogsService.getTraderDashboard(traderId);
        return ResponseEntity.ok(dashboard);
    }
}

