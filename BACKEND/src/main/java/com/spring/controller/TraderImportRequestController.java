package com.spring.controller;

import com.spring.dto.InventoryLogsDTO;
import com.spring.service.InventoryLogsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trader")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TraderImportRequestController {

    @Autowired
    private InventoryLogsService inventoryLogsService;

    /**
     * 📥 API: Lấy danh sách yêu cầu nhập hàng mới từ Importer (status = 0)
     * => Dùng cho phần "Yêu cầu nhập hàng mới"
     */
    @GetMapping("/import-requests")
    public ResponseEntity<?> getPendingImportRequests() {
        List<InventoryLogsDTO> logs = inventoryLogsService.getPendingRequestsForTrader();

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Tất cả đơn nhập hàng đang chờ xử lý từ Importer");
        res.put("logs", logs);
        return ResponseEntity.ok(res);
    }

    /**
     * 📦 API: Lịch sử các đơn đã xử lý (status = 1 - đã giao, 2 - từ chối)
     * => Dùng cho phần "Lịch sử xử lý đơn nhập"
     */
    @GetMapping("/import-history")
    public ResponseEntity<?> getProcessedRequests() {
        List<InventoryLogsDTO> logs = inventoryLogsService.getProcessedRequestsForTrader();

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Lịch sử xử lý đơn hàng nhập");
        res.put("logs", logs);
        return ResponseEntity.ok(res);
    }

    /**
     * ✅ API: Trader xác nhận đã giao hàng cho Importer
     */
    @PostMapping("/confirm-shipping")
    public ResponseEntity<?> confirmShipping(@RequestBody InventoryLogsDTO dto) {
        try {
            InventoryLogsDTO updated = inventoryLogsService.confirmShippingToImporter(dto);

            Map<String, Object> res = new HashMap<>();
            res.put("message", "Trader xác nhận đã giao hàng thành công!");
            res.put("log", updated);
            return ResponseEntity.ok(res);
        } catch (RuntimeException e) {
            Map<String, Object> err = new HashMap<>();
            err.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    /**
     * ❌ API: Trader từ chối giao hàng cho Importer
     */
    @PostMapping("/reject")
    public ResponseEntity<?> rejectShipping(@RequestBody InventoryLogsDTO dto) {
        InventoryLogsDTO updated = inventoryLogsService.rejectShippingRequest(dto);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Trader đã từ chối đơn hàng.");
        res.put("log", updated);
        return ResponseEntity.ok(res);
    }
}
