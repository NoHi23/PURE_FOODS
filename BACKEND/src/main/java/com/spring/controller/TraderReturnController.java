package com.spring.controller;

import com.spring.dto.InventoryLogsDTO;
import com.spring.service.InventoryLogsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/trader/returns")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TraderReturnController {

    @Autowired
    private InventoryLogsService inventoryLogsService;

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingReturns() {
        List<InventoryLogsDTO> list = inventoryLogsService.getPendingReturnsForTrader(0); // traderId not used now
        Map<String, Object> res = new HashMap<>();
        res.put("message", "Danh sách đơn trả hàng đang chờ");
        res.put("logs", list);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmReturn(@RequestBody InventoryLogsDTO dto) {
        InventoryLogsDTO updated = inventoryLogsService.confirmReturnByTrader(dto);
        Map<String, Object> res = new HashMap<>();
        res.put("message", "Trader xác nhận đã nhận lại hàng");
        res.put("log", updated);
        return ResponseEntity.ok(res);
    }
}
