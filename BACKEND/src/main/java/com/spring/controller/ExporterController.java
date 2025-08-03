package com.spring.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.spring.dto.ExporterDTO;
import com.spring.dto.InventoryLogsDTO;
import com.spring.dto.OrderDTO;
import com.spring.dto.OrderDetailDTO;
import com.spring.entity.OrderDetail;
import com.spring.service.ExporterService;
import com.spring.service.InventoryLogsService;
import com.spring.service.OrderDetailService;
import com.spring.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exporter")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ExporterController {

    @Autowired
    private ExporterService exporterService;

    @Autowired
    private InventoryLogsService inventoryLogsService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderDetailService orderDetailService;

    @GetMapping("/orders")
    public ResponseEntity<Map<String, Object>> getAllOrdersForExport() {
        try {
            List<OrderDTO> orders = orderService.getAllOrders();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Lấy danh sách đơn hàng thành công!");
            response.put("status", 200);
            response.put("orders", orders);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse("Lỗi khi lấy danh sách đơn hàng: " + e.getMessage(), 400);
        }
    }

    @GetMapping("/requests")
    public ResponseEntity<Map<String, Object>> getAllExportRequests() {
        try {
            List<ExporterDTO> requests = exporterService.getAllExportRequests();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Lấy danh sách yêu cầu xuất hàng thành công!");
            response.put("status", 200);
            response.put("requests", requests);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse("Lỗi khi lấy danh sách yêu cầu xuất hàng: " + e.getMessage(), 400);
        }
    }

    @GetMapping("/requests/{orderId}")
    public ResponseEntity<Map<String, Object>> getExportRequestById(@PathVariable("orderId") int orderId) {
        try {
            ExporterDTO exporterDTO = exporterService.getExportRequestById(orderId);
            if (exporterDTO == null) {
                return buildErrorResponse("Không tìm thấy yêu cầu xuất hàng với ID: " + orderId, 404);
            }
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Lấy chi tiết yêu cầu xuất hàng thành công!");
            response.put("status", 200);
            response.put("order", exporterDTO);
            if (exporterDTO.getStatusID() == 5) {
                response.put("cancelReason", exporterDTO.getCancelReason());
            }
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse("Lỗi khi lấy chi tiết yêu cầu xuất hàng: " + e.getMessage(), 400);
        }
    }

    @PostMapping("/requests")
    public ResponseEntity<Map<String, Object>> createExportRequest(@RequestBody Map<String, Object> payload) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            // Bước 1: Validate đầu vào
            if (!payload.containsKey("orderID") || payload.get("orderID") == null) {
                return buildErrorResponse("Thiếu orderID trong payload!", 400);
            }

            // Bước 2: Parse và validate orderID
            Integer orderID;
            try {
                orderID = Integer.parseInt(payload.get("orderID").toString());
            } catch (NumberFormatException e) {
                return buildErrorResponse("orderID phải là số nguyên!", 400);
            }

            // Bước 3: Lấy thông tin đơn hàng từ OrderService
            OrderDTO orderDTO = orderService.getOrderById(orderID);
            if (orderDTO == null) {
                return buildErrorResponse("Không tìm thấy đơn hàng với ID: " + orderID, 404);
            }
            if (orderDTO.getStatusID() == 5) {
                return buildErrorResponse("Không thể tạo xuất hàng cho đơn đã hủy!", 400);
            }

            // Bước 4: Tạo ExporterDTO từ thông tin đơn hàng
            ExporterDTO exportRequest = new ExporterDTO();
            exportRequest.setOrderID(orderID);
            exportRequest.setCustomerID(orderDTO.getCustomerID());
            Integer statusID = orderDTO.getStatusID() != null ? orderDTO.getStatusID() : 1;
            // Validate statusID
            if (!List.of(1, 2, 3, 4, 5).contains(statusID)) {
                return buildErrorResponse("statusID không hợp lệ! Chỉ chấp nhận các giá trị: 1, 2, 3, 4, 5", 400);
            }
            exportRequest.setStatusID(statusID);
            exportRequest.setShippingAddress(orderDTO.getShippingAddress());
            exportRequest.setTotalAmount(orderDTO.getTotalAmount());
            exportRequest.setDiscountAmount(orderDTO.getDiscountAmount());
            exportRequest.setOrderDate(orderDTO.getOrderDate());
            exportRequest.setEstimatedDeliveryDate(orderDTO.getEstimatedDeliveryDate());

            // Bước 5: Ghi đè các thông tin bổ sung từ payload (nếu có)
            if (payload.containsKey("shippingMethodID") && payload.get("shippingMethodID") != null) {
                try {
                    exportRequest.setShippingMethodID(Integer.parseInt(payload.get("shippingMethodID").toString()));
                } catch (NumberFormatException e) {
                    return buildErrorResponse("shippingMethodID phải là số nguyên!", 400);
                }
            }
            if (payload.containsKey("driverID") && payload.get("driverID") != null) {
                try {
                    exportRequest.setDriverID(Integer.parseInt(payload.get("driverID").toString()));
                } catch (NumberFormatException e) {
                    return buildErrorResponse("driverID phải là số nguyên!", 400);
                }
            }
            if (payload.containsKey("shippingCost") && payload.get("shippingCost") != null) {
                try {
                    exportRequest.setShippingCost(Double.parseDouble(payload.get("shippingCost").toString()));
                } catch (NumberFormatException e) {
                    return buildErrorResponse("shippingCost phải là số thực!", 400);
                }
            }
            if (payload.containsKey("distance") && payload.get("distance") != null) {
                try {
                    exportRequest.setDistance(Double.parseDouble(payload.get("distance").toString()));
                } catch (NumberFormatException e) {
                    return buildErrorResponse("distance phải là số thực!", 400);
                }
            }
            if (payload.containsKey("statusID") && payload.get("statusID") != null) {
                try {
                    statusID = Integer.parseInt(payload.get("statusID").toString());
                    if (!List.of(1, 2, 3, 4, 5).contains(statusID)) {
                        return buildErrorResponse("statusID không hợp lệ! Chỉ chấp nhận các giá trị: 1, 2, 3, 4, 5", 400);
                    }
                    exportRequest.setStatusID(statusID);
                } catch (NumberFormatException e) {
                    return buildErrorResponse("statusID phải là số nguyên!", 400);
                }
            }

            // Bước 6: Lấy danh sách orderDetails từ OrderDetailService
            List<OrderDetail> orderDetailsEntity = orderDetailService.getByOrderID(orderID);
            if (orderDetailsEntity == null || orderDetailsEntity.isEmpty()) {
                return buildErrorResponse("Không tìm thấy chi tiết đơn hàng cho ID: " + orderID, 404);
            }
            List<OrderDetailDTO> orderDetails = orderDetailsEntity.stream()
                    .map(detail -> new OrderDetailDTO(
                            detail.getOrderDetailID(),
                            detail.getProductID(),
                            orderID,
                            detail.getQuantity(),
                            detail.getUnitPrice(),
                            detail.getStatus()
                    ))
                    .collect(Collectors.toList());

            // Bước 7: Gọi service để xử lý
            exporterService.createExportRequest(exportRequest, orderDetails);

            // Bước 8: Trả về thông báo thành công
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đơn xuất hàng đã được tạo thành công dựa trên đơn hàng ID: " + orderID);
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse("Lỗi khi tạo đơn xuất hàng: " + e.getMessage(), 400);
        }
    }

    @PutMapping("/requests/{orderId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelExportRequest(
            @PathVariable("orderId") int orderId,
            @RequestBody String cancelReason,
            @RequestParam("exporterId") int exporterId) {
        try {
            exporterService.cancelExportRequest(orderId, cancelReason, exporterId);
            return buildSuccessResponse("Hủy yêu cầu xuất hàng thành công!");
        } catch (RuntimeException e) {
            return buildErrorResponse("Lỗi khi hủy yêu cầu xuất hàng: " + e.getMessage(), 400);
        }
    }

    @PutMapping("/requests/{orderId}/confirm")
    public ResponseEntity<Map<String, Object>> confirmOrder(@PathVariable("orderId") int orderId,
                                                            @RequestParam("exporterId") int exporterId) {
        try {
            exporterService.confirmOrder(orderId, exporterId);
            return buildSuccessResponse("Xác nhận đơn hàng thành công!");
        } catch (RuntimeException e) {
            return buildErrorResponse("Lỗi khi xác nhận đơn hàng: " + e.getMessage(), 400);
        }
    }

    @PutMapping("/requests/{orderId}/reject")
    public ResponseEntity<Map<String, Object>> rejectOrder(@PathVariable("orderId") int orderId,
                                                           @RequestBody String rejectReason,
                                                           @RequestParam("exporterId") int exporterId) {
        try {
            exporterService.rejectOrder(orderId, rejectReason, exporterId);
            return buildSuccessResponse("Từ chối đơn hàng thành công!");
        } catch (RuntimeException e) {
            return buildErrorResponse("Lỗi khi từ chối đơn hàng: " + e.getMessage(), 400);
        }
    }

    @GetMapping("/inventory/check")
    public ResponseEntity<Map<String, Object>> checkInventory(@RequestParam("productId") int productId,
                                                              @RequestParam("quantity") int quantity) {
        try {
            boolean available = exporterService.checkInventoryAvailability(productId, quantity);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Kiểm tra tồn kho thành công!");
            response.put("status", 200);
            response.put("available", available);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse("Lỗi khi kiểm tra tồn kho: " + e.getMessage(), 400);
        }
    }

    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getExportHistory(@RequestParam(value = "productId", defaultValue = "0") int productId,
                                                                @RequestParam(value = "orderId", defaultValue = "0") int orderId) {
        try {
            List<InventoryLogsDTO> history = exporterService.getExportHistory(productId, orderId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Lấy lịch sử xuất hàng thành công!");
            response.put("status", 200);
            response.put("history", history);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse("Lỗi khi lấy lịch sử xuất hàng: " + e.getMessage(), 400);
        }
    }

    @PostMapping("/inventory-logs/archive")
    public ResponseEntity<Map<String, Object>> archiveOrder(@RequestBody Map<String, Integer> payload) {
        try {
            int logId = payload.get("logId");
            InventoryLogsDTO archivedLog = inventoryLogsService.archiveLog(logId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Lưu trữ đơn hàng thành công!");
            response.put("status", 200);
            response.put("log", archivedLog);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse("Lỗi khi lưu trữ đơn hàng: " + e.getMessage(), 400);
        }
    }

    private ResponseEntity<Map<String, Object>> buildSuccessResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("status", 200);
        return ResponseEntity.ok(response);
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(String message, int status) {
        Map<String, Object> error = new HashMap<>();
        error.put("message", message);
        error.put("status", status);
        return ResponseEntity.status(status).body(error);
    }
}