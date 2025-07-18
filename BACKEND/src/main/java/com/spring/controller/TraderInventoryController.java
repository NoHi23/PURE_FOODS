package com.spring.controller;

import com.spring.dto.InventoryLogsDTO;
import com.spring.dto.TraderStockDTO;
import com.spring.entity.TraderInventoryLogs;
import com.spring.entity.User;
import com.spring.service.TraderInventoryService;
import com.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/trader/inventory")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TraderInventoryController {

    @Autowired
    private TraderInventoryService traderInventoryService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getCurrentStock(@RequestParam("userId") int userId) { // Chỉ định tên tham số
        try {
            List<TraderStockDTO> result = traderInventoryService.getCurrentStockOfTrader(userId);
            Map<String, Object> res = new HashMap<>();
            res.put("message", "Tồn kho hiện tại của Trader");
            res.put("data", result);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/create-stock-update")
    public ResponseEntity<?> createTraderStockUpdate(@RequestParam("userId") int userId,
                                                     @RequestParam("productId") int productId,
                                                     @RequestParam("quantityChange") int quantityChange) {
        try {
            TraderInventoryLogs log = traderInventoryService.createTraderStockUpdate(userId, productId, quantityChange);
            return ResponseEntity.ok(Map.of("message", "Tạo stock update thành công!", "log", log));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/confirm-stock-update")
    public ResponseEntity<?> confirmTraderStockUpdate(@RequestParam("userId") int userId,
                                                      @RequestParam("logId") int logId) {
        try {
            TraderInventoryLogs log = traderInventoryService.confirmTraderStockUpdate(logId, userId);
            return ResponseEntity.ok(Map.of("message", "Xác nhận stock update thành công!", "log", log));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }



    @GetMapping("/all-logs")
    public ResponseEntity<?> getAllTraderInventoryLogs(@RequestParam("userId") int userId) {
        try {
            List<TraderInventoryLogs> logs = traderInventoryService.getAllTraderInventoryLogs(userId);
            return ResponseEntity.ok(Map.of("message", "Tất cả log của trader", "logs", logs));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/import")
    public ResponseEntity<?> traderCreateInventoryImport(@RequestParam("userId") int userId,
                                                         @RequestParam("productId") int productId,
                                                         @RequestParam("quantityChange") int quantityChange) {
        try {
            TraderInventoryLogs log = traderInventoryService.traderCreateInventoryImport(userId, productId, quantityChange);
            return ResponseEntity.ok(Map.of("message", "Trader nhập kho thành công", "log", log));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/pending-requests")
    public ResponseEntity<?> getPendingRequestsFromImporter(@RequestParam("userId") int userId) {
        try {
            List<InventoryLogsDTO> requests = traderInventoryService.getPendingRequestsFromImporter(userId);
            return ResponseEntity.ok(Map.of("message", "Danh sách yêu cầu từ Importer", "requests", requests));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/confirm-shipping")
    public ResponseEntity<?> confirmShippingToImporter(@RequestParam("userId") int userId,
                                                       @RequestParam("logId") int logId) {
        try {
            InventoryLogsDTO updatedLog = traderInventoryService.confirmShippingToImporter(logId, userId);
            return ResponseEntity.ok(Map.of("message", "Xác nhận giao hàng thành công", "log", updatedLog));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/reject-shipping")
    public ResponseEntity<?> rejectShippingToImporter(@RequestParam("userId") int userId,
                                                      @RequestParam("logId") int logId) {
        try {
            InventoryLogsDTO updatedLog = traderInventoryService.rejectShippingToImporter(logId, userId);
            return ResponseEntity.ok(Map.of("message", "Từ chối giao hàng thành công", "log", updatedLog));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @PostMapping("/add-stock")
    public ResponseEntity<?> addStockToProduct(@RequestParam("userId") int userId,
                                               @RequestParam("productId") int productId,
                                               @RequestParam("quantityToAdd") int quantityToAdd) {
        try {
            TraderStockDTO updatedProduct = traderInventoryService.addStockToProduct(userId, productId, quantityToAdd);
            return ResponseEntity.ok(Map.of("message", "Thêm hàng vào sản phẩm thành công!", "product", updatedProduct));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    // Thêm API để tạo mặt hàng mới
    @PostMapping("/create-product")
    public ResponseEntity<?> createNewProduct(@RequestParam("userId") int userId,
                                              @RequestParam("productName") String productName,
                                              @RequestParam("price") double price,
                                              @RequestParam("initialStockQuantity") int initialStockQuantity,
                                              @RequestParam("warehouseLocation") String warehouseLocation) {
        try {
            TraderStockDTO newProduct = traderInventoryService.createNewProduct(userId, productName, price, initialStockQuantity, warehouseLocation);
            return ResponseEntity.ok(Map.of("message", "Tạo mặt hàng mới thành công!", "product", newProduct));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}