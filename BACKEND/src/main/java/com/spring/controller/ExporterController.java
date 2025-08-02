package com.spring.controller;

import com.spring.dto.*;
import com.spring.entity.User;
import com.spring.service.ExporterService;
import com.spring.service.OrderService;
import com.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exporter")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ExporterController {

    @Autowired
    private ExporterService exporterService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @GetMapping("/export-requests")
    public ResponseEntity<?> getExportRequests() {
        try {
            List<ExporterDTO> exportRequests = exporterService.getAllExportRequests();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Lấy danh sách yêu cầu xuất hàng thành công!");
            response.put("status", 200);
            response.put("orders", exportRequests);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/export-requests")
    public ResponseEntity<?> createExportRequest(@RequestBody ExportRequestPayload payload, @RequestParam("exporterId") int exporterId) {
        try {
            ExporterDTO exporterDTO = payload.getExporterDTO();
            List<OrderDetailDTO> orderDetails = payload.getOrderDetails();
            if (exporterDTO == null || orderDetails == null || orderDetails.isEmpty() || exporterDTO.getOrderID() <= 0 || exporterDTO.getCustomerID() <= 0) {
                throw new IllegalArgumentException("Dữ liệu yêu cầu không hợp lệ: exporterDTO, orderDetails, orderID hoặc customerID không hợp lệ");
            }
            // Kiểm tra trạng thái đơn hàng
            OrderDTO orderDTO = orderService.getOrderById(exporterDTO.getOrderID());
            if (orderDTO == null) {
                throw new IllegalArgumentException("Đơn hàng không tồn tại với orderID: " + exporterDTO.getOrderID());
            }
            if (orderDTO.getStatusID() != 2) {
                throw new IllegalArgumentException("Đơn hàng phải ở trạng thái Processing (statusID = 2) để tạo yêu cầu xuất hàng.");
            }
            exporterService.createExportRequest(exporterDTO, orderDetails, exporterId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tạo yêu cầu xuất hàng thành công!");
            response.put("status", 200);
            response.put("order", exporterDTO);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/request-cancel/{orderId}")
    public ResponseEntity<?> requestCancelOrder(
            @PathVariable("orderId") int orderId,
            @RequestBody Map<String, String> request,
            @RequestParam("customerId") int customerId
    ) {
        try {
            if (orderId <= 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "orderID không hợp lệ.");
                errorResponse.put("status", 400);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }
            String cancelReason = request.get("cancelReason");
            if (cancelReason == null || cancelReason.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "Lý do hủy không được để trống.");
                errorResponse.put("status", 400);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }
            exporterService.requestCancelOrder(orderId, cancelReason, customerId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Gửi yêu cầu hủy đơn hàng thành công!");
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @DeleteMapping("/cancel-request/{orderId}")
    public ResponseEntity<?> cancelExportRequest(
            @PathVariable("orderId") int orderId,
            @RequestBody Map<String, String> request,
            @RequestParam("exporterId") int exporterId
    ) {
        try {
            if (orderId <= 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "orderID không hợp lệ.");
                errorResponse.put("status", 400);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }
            String cancelReason = request.get("cancelReason");
            exporterService.cancelExportRequest(orderId, cancelReason, exporterId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Hủy yêu cầu xuất hàng thành công!");
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/update-status/{orderId}")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable("orderId") int orderId,
            @RequestParam("exporterId") int exporterId,
            @RequestBody Map<String, Integer> request
    ) {
        try {
            if (orderId <= 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "orderID không hợp lệ.");
                errorResponse.put("status", 400);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }
            Integer newStatusId = request.get("statusId");
            if (newStatusId == null || !List.of(2, 3, 4, 5).contains(newStatusId)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "statusID không hợp lệ. Chỉ chấp nhận: 2 (Processing), 3 (Shipped), 4 (Delivered), 5 (Cancelled).");
                errorResponse.put("status", 400);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }
            // Kiểm tra quyền của shipper khi chuyển sang statusID = 4 (Delivered)
            if (newStatusId == 4) {
                User user = userService.findById(exporterId)
                        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với ID: " + exporterId));
                if (user.getRoleID() != 6) { // RoleID 6 là Shipper
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("message", "Chỉ có Shipper mới có thể cập nhật trạng thái sang Delivered.");
                    errorResponse.put("status", 403);
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
                }
            }
            exporterService.updateOrderStatus(orderId, newStatusId, exporterId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Cập nhật trạng thái đơn hàng thành công!");
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/export-history")
    public ResponseEntity<?> getExportHistory(
            @RequestParam(value = "statusId", required = false) Integer statusId,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam(value = "filterType", required = false) String filterType) {
        try {
            List<ExporterDTO> exportHistory = exporterService.getExportHistory(statusId, startDate, endDate, filterType);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Lấy lịch sử đơn xuất hàng thành công!");
            response.put("status", 200);
            response.put("orders", exportHistory);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/export-requests/list")
    public ResponseEntity<?> getExportRequestsList() {
        try {
            List<ExporterDTO> exportRequests = exporterService.getAllExportRequests();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Lấy danh sách yêu cầu xuất hàng thành công!");
            response.put("status", 200);
            response.put("orders", exportRequests);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/export-requests/{orderId}")
    public ResponseEntity<?> getExportRequestDetails(@PathVariable("orderId") int orderId) {
        try {
            if (orderId <= 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "orderID không hợp lệ.");
                errorResponse.put("status", 400);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }
            ExporterDTO exporterDTO = exporterService.getExportRequestById(orderId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Lấy chi tiết yêu cầu xuất hàng thành công!");
            response.put("status", 200);
            response.put("order", exporterDTO);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(
            @RequestParam("userId") int userId
    ) {
        try {
            List<NotificationDTO> notifications = exporterService.getNotificationsByUserId(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Lấy danh sách thông báo thành công!");
            response.put("status", 200);
            response.put("notifications", notifications);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/check-inventory")
    public ResponseEntity<?> checkInventory(
            @RequestParam("productId") int productId,
            @RequestParam("quantity") int quantity
    ) {
        try {
            boolean available = exporterService.checkInventoryAvailability(productId, quantity);
            Map<String, Object> response = new HashMap<>();
            response.put("message", available ? "Sản phẩm đủ tồn kho!" : "Sản phẩm không đủ tồn kho!");
            response.put("status", 200);
            response.put("available", available);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/order-tracking")
    public ResponseEntity<?> trackExportOrders(
            @RequestParam(value = "statusId", required = false) Integer statusId,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate
    ) {
        try {
            List<ExporterDTO> orders = exporterService.trackExportOrders(statusId, startDate, endDate);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Lấy danh sách trạng thái đơn hàng xuất kho thành công!");
            response.put("status", 200);
            response.put("orders", orders);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/order-tracking/{orderId}")
    public ResponseEntity<?> getOrderTrackingDetails(@PathVariable("orderId") int orderId) {
        try {
            if (orderId <= 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "orderID không hợp lệ.");
                errorResponse.put("status", 400);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }
            ExporterDTO orderDetails = exporterService.getOrderTrackingDetails(orderId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Lấy chi tiết trạng thái đơn hàng xuất kho thành công!");
            response.put("status", 200);
            response.put("order", orderDetails);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/export-stats")
    public ResponseEntity<?> getExportStats() {
        try {
            Map<String, Integer> stats = exporterService.getExportStats();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Lấy thống kê xuất hàng thành công!");
            response.put("status", 200);
            response.put("stats", stats);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/inventory-products")
    public ResponseEntity<?> getInventoryProducts() {
        try {
            List<ProductDTO> products = exporterService.getInventoryProducts();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Lấy danh sách sản phẩm trong kho thành công!");
            response.put("status", 200);
            response.put("products", products);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    public static class ExportRequestPayload {
        private ExporterDTO exporterDTO;
        private List<OrderDetailDTO> orderDetails;

        public ExporterDTO getExporterDTO() {
            return exporterDTO;
        }

        public void setExporterDTO(ExporterDTO exporterDTO) {
            this.exporterDTO = exporterDTO;
        }

        public List<OrderDetailDTO> getOrderDetails() {
            return orderDetails;
        }

        public void setOrderDetails(List<OrderDetailDTO> orderDetails) {
            this.orderDetails = orderDetails;
        }
    }
}