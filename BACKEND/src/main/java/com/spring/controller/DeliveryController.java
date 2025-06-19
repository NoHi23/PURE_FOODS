package com.spring.controller;

import com.spring.dto.ConfirmDeliveryRequestDTO;
import com.spring.dto.PrepareDeliveryRequestDTO;
import com.spring.entity.Orders;
import com.spring.entity.OrderDetails;
import com.spring.entity.Products;
import com.spring.service.DeliveryService;
import com.spring.dto.DeliveryResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    private DeliveryResponseDTO toDTO(Orders order) {
        if (order == null) return null;
        DeliveryResponseDTO dto = new DeliveryResponseDTO();
        dto.orderId = order.getOrderId();
        dto.customerName = order.getCustomer() != null ? order.getCustomer().getFullName() : null;
        dto.customerPhone = order.getCustomer() != null ? order.getCustomer().getPhone() : null;
        dto.customerAddress = order.getCustomer() != null ? order.getCustomer().getAddress() : null;
        dto.totalAmount = order.getTotalAmount();
        dto.orderDate = order.getOrderDate() != null ? order.getOrderDate().toString() : null;
        dto.status = order.getStatus() != null ? order.getStatus().getStatusName() : null;
        dto.shippingMethod = order.getShippingMethod() != null ? order.getShippingMethod().getMethodName() : null;
        dto.shippingCost = order.getShippingCost();
        dto.estimatedDeliveryDate = order.getEstimatedDeliveryDate() != null ? order.getEstimatedDeliveryDate().toString() : null;
        dto.driverName = order.getDriver() != null ? order.getDriver().getDriverName() : null;
        dto.driverPhone = order.getDriver() != null ? order.getDriver().getPhone() : null;
        if (order.getOrderDetails() != null) {
            dto.products = order.getOrderDetails().stream().map(od -> {
                DeliveryResponseDTO.ProductInfo p = new DeliveryResponseDTO.ProductInfo();
                Products prod = od.getProduct();
                p.productId = prod != null ? prod.getProductId() : null;
                p.productName = prod != null ? prod.getProductName() : null;
                p.quantity = od.getQuantity();
                p.unitPrice = od.getUnitPrice();
                return p;
            }).collect(Collectors.toList());
        }
        return dto;
    }

@PutMapping("/prepare/{orderId}")
public ResponseEntity<String> prepareDelivery(
        @PathVariable Integer orderId,
        @RequestBody PrepareDeliveryRequestDTO request) {
    Orders order = deliveryService.prepareDelivery(orderId, request.estimatedDeliveryDate);
    if (order != null) {
        return ResponseEntity.ok("Chuẩn bị giao hàng thành công!");
    } else {
        return ResponseEntity.status(404).body("Không tìm thấy đơn hàng!");
    }
}
  @PutMapping("/assign-driver/{orderId}")
public ResponseEntity<String> assignDriver(@PathVariable Integer orderId, @RequestParam Integer driverId) {
    Orders order = deliveryService.assignDriver(orderId, driverId);
    if (order != null) {
        return ResponseEntity.ok("Gán tài xế thành công!");
    } else {
        return ResponseEntity.status(404).body("Không tìm thấy đơn hàng!");
    }
}

@PutMapping("/update-status/{orderId}")
public ResponseEntity<String> updateDeliveryStatus(@PathVariable Integer orderId, @RequestParam String status) {
    Orders order = deliveryService.updateDeliveryStatus(orderId, status);
    if (order != null) {
        return ResponseEntity.ok("Cập nhật trạng thái giao hàng thành công!");
    } else {
        return ResponseEntity.status(404).body("Không tìm thấy đơn hàng!");
    }
}

@PutMapping("/confirm/{orderId}")
public ResponseEntity<String> confirmDelivery(
        @PathVariable Integer orderId,
        @RequestBody(required = false) ConfirmDeliveryRequestDTO request) {
    String delayReason = (request != null) ? request.delayReason : null;
    Orders order = deliveryService.confirmDelivery(orderId, delayReason);
    if (order != null) {
        return ResponseEntity.ok("Xác nhận giao hàng thành công!");
    } else {
        return ResponseEntity.status(404).body("Không tìm thấy đơn hàng!");
    }
}
@PostMapping("/notify/{orderId}")
public ResponseEntity<String> notifyDelivery(@PathVariable Integer orderId) {
    deliveryService.notifyDelivery(orderId);
    return ResponseEntity.ok("Đã gửi thông báo giao hàng!");
}
}