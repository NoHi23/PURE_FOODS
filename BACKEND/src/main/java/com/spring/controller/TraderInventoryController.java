package com.spring.controller;

import com.spring.dto.InventoryLogsDTO;
import com.spring.dto.TraderStockDTO;
import com.spring.service.TraderInventoryService;
import com.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trader/inventory")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TraderInventoryController {

    @Autowired
    private TraderInventoryService traderInventoryService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getCurrentStock(@RequestParam("userId") int userId) {
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





    @GetMapping("/pending-requests")
    public ResponseEntity<Map<String, Object>> getPendingRequestsFromImporter(@RequestParam("userId") int userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<InventoryLogsDTO> requests = traderInventoryService.getPendingRequestsFromImporter(userId);

            response.put("message", "Danh sách yêu cầu từ Importer");
            response.put("requests", requests);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("message", "Lỗi khi lấy yêu cầu từ Importer");
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
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
                                                      @RequestParam("logId") int logId,
                                                      @RequestParam("reason") String reason) {
        try {
            InventoryLogsDTO updatedLog = traderInventoryService.rejectShippingToImporter(logId, userId, reason);
            return ResponseEntity.ok(Map.of("message", "Từ chối giao hàng thành công", "log", updatedLog));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Lấy danh sách đơn trả hàng từ Importer (status = 5)
    @GetMapping("/return-requests")
    public ResponseEntity<?> getReturnRequestsFromImporter(@RequestParam("userId") int userId) {
        try {
            List<InventoryLogsDTO> result = traderInventoryService.getReturnRequestsFromImporter(userId);
            return ResponseEntity.ok(Map.of("message", "Danh sách đơn trả hàng đang chờ xử lý", "logs", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Xác nhận trả hàng: cộng số lượng vào kho và cập nhật status = 6
    @PostMapping("/confirm-return")
    public ResponseEntity<?> confirmReturnRequest(@RequestParam("logId") int logId,
                                                  @RequestParam("userId") int traderId) {
        try {
            InventoryLogsDTO updated = traderInventoryService.confirmReturnFromImporter(logId, traderId);
            return ResponseEntity.ok(Map.of("message", "Đã xác nhận trả hàng", "log", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Từ chối trả hàng: ghi lý do và cập nhật status = 7
    @PostMapping("/reject-return")
    public ResponseEntity<?> rejectReturnRequest(@RequestParam("logId") int logId,
                                                 @RequestParam("userId") int traderId,
                                                 @RequestParam("reason") String reason) {
        try {
            InventoryLogsDTO updated = traderInventoryService.rejectReturnFromImporter(logId, traderId, reason);
            return ResponseEntity.ok(Map.of("message", "Đã từ chối đơn trả hàng", "log", updated));
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

    // Cập nhật API để tạo mặt hàng mới, thêm imageURL
    @PostMapping("/create-product")
    public ResponseEntity<?> createNewProduct(@RequestParam("userId") int userId,
                                              @RequestParam("productName") String productName,
                                              @RequestParam("price") double price,
                                              @RequestParam("initialStockQuantity") int initialStockQuantity,
                                              @RequestParam("warehouseLocation") String warehouseLocation,
                                              @RequestParam(value = "imageURL", required = false) String imageURL) {
        try {
            TraderStockDTO newProduct = traderInventoryService.createNewProduct(userId, productName, price, initialStockQuantity, warehouseLocation, imageURL);
            return ResponseEntity.ok(Map.of("message", "Tạo mặt hàng mới thành công!", "product", newProduct));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Cập nhật sản phẩm
    @PutMapping("/update-product")
    public ResponseEntity<?> updateProduct(@RequestParam("userId") int userId,
                                           @RequestParam("productId") int productId,
                                           @RequestParam("productName") String productName,
                                           @RequestParam("price") double price,
                                           @RequestParam("warehouseLocation") String warehouseLocation,
                                           @RequestParam(value = "imageURL", required = false) String imageURL) {
        try {
            TraderStockDTO updated = traderInventoryService.updateProduct(userId, productId, productName, price, warehouseLocation, imageURL);
            return ResponseEntity.ok(Map.of("message", "Cập nhật sản phẩm thành công!", "product", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Xoá sản phẩm
    @DeleteMapping("/delete-product")
    public ResponseEntity<?> deleteProduct(@RequestParam("userId") int userId,
                                           @RequestParam("traderProductId") int traderProductId) { // Thay productId bằng traderProductId
        try {
            traderInventoryService.deleteProduct(userId, traderProductId);
            return ResponseEntity.ok(Map.of("message", "Xóa sản phẩm thành công!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    // Thêm endpoint để cập nhật trạng thái
    @PutMapping("/update-status")
    public ResponseEntity<?> updateProductStatus(@RequestParam("userId") int userId,
                                                 @RequestParam("traderProductId") int traderProductId,
                                                 @RequestParam("status") int status) {
        try {
            TraderStockDTO updatedProduct = traderInventoryService.updateProductStatus(userId, traderProductId, status);
            String message = status == 1 ? "Kích hoạt sản phẩm thành công!" : "Vô hiệu hóa sản phẩm thành công!";
            return ResponseEntity.ok(Map.of("message", message, "product", updatedProduct));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @GetMapping("/history")
    public ResponseEntity<?> getHistoryOfTrader(@RequestParam("userId") int userId,
                                                @RequestParam(value = "status", required = false) Integer status) {
        try {
            List<InventoryLogsDTO> historyLogs = traderInventoryService.getAllLogsOfTrader(userId);
            if (status != null) {
                historyLogs = historyLogs.stream()
                        .filter(log -> log.getStatus() == status)
                        .collect(Collectors.toList());
            }
            return ResponseEntity.ok(Map.of("message", "Lịch sử đơn hàng của Trader", "logs", historyLogs));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @GetMapping("/return-history")
    public ResponseEntity<?> getReturnHistoryOfTrader(@RequestParam("userId") int userId,
                                                      @RequestParam(value = "status", required = false) Integer status) {
        try {
            List<InventoryLogsDTO> historyLogs = traderInventoryService.getReturnLogsOfTrader(userId);

            // Nếu có filter status = 6 hoặc 7
            if (status != null) {
                historyLogs = historyLogs.stream()
                        .filter(log -> log.getStatus() == status)
                        .collect(Collectors.toList());
            }

            return ResponseEntity.ok(Map.of(
                    "message", "Lịch sử đơn trả hàng của Trader",
                    "logs", historyLogs
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }




}
