package com.spring.controller;

import com.spring.service.InventoryLogsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.spring.dto.InventoryLogsDTO;
import com.spring.dto.ProductExportSummaryDTO;
import java.util.*;

@RestController
@RequestMapping("/api/trader/report")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TraderReportController {

    @Autowired
    private InventoryLogsService inventoryLogsService;

    @GetMapping("/summary/{traderId}")
    public ResponseEntity<?> getSummary(@PathVariable("traderId") int traderId) {
        Map<String, Object> report = inventoryLogsService.getTraderReportSummary(traderId);
        return ResponseEntity.ok(report);
    }
    @GetMapping("/history/{traderId}")
    public ResponseEntity<?> getTraderHistory(@PathVariable("traderId") int traderId) {
        List<InventoryLogsDTO> history = inventoryLogsService.getShippingHistoryByTrader(traderId);
        Map<String, Object> res = new HashMap<>();
        res.put("message", "Lịch sử xuất hàng của Trader");
        res.put("logs", history);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/by-product/{traderId}")
    public ResponseEntity<?> getSummaryByProduct(@PathVariable("traderId") int traderId) {
        List<ProductExportSummaryDTO> result = inventoryLogsService.getTotalSuppliedPerProduct(traderId);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Tổng số lượng đã xuất theo từng sản phẩm");
        response.put("data", result);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/monthly/{traderId}")
    public ResponseEntity<?> getMonthlySummary(@PathVariable("traderId") int traderId) {
        Map<String, Integer> data = inventoryLogsService.getMonthlyExportSummary(traderId);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Thống kê hàng đã xuất theo tháng");
        response.put("data", data);
        return ResponseEntity.ok(response);
    }




}
