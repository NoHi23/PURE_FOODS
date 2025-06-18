package com.spring.controller;

import com.spring.dto.OrderProductInventoryDTO;
import com.spring.entity.Orders;
import com.spring.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.spring.dto.ProductInventoryDTO;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    //@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @GetMapping("/check/{productId}")
    public ResponseEntity<Integer> checkStock(@PathVariable("productId") Integer productId) {
        Integer stock = inventoryService.checkStock(productId);
        return ResponseEntity.ok(stock);
    }

    //@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
  @PutMapping("/confirm-order/{orderId}")
public ResponseEntity<String> confirmOrder(@PathVariable("orderId") Integer orderId) {
    Orders order = inventoryService.confirmOrder(orderId);
    if (order != null) {
        return ResponseEntity.ok("Xác nhận đơn hàng thành công!");
    } else {
        return ResponseEntity.status(404).body("Không tìm thấy đơn hàng!");
    }
}

    //@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @PutMapping("/reject-order/{orderId}")
    public ResponseEntity<Orders> rejectOrder(
            @PathVariable("orderId") Integer orderId,
            @RequestParam("reason") String reason) {
        Orders order = inventoryService.rejectOrder(orderId, reason);
        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @PutMapping("/update-stock/{productId}")
    public ResponseEntity<Void> updateStock(
            @PathVariable("productId") Integer productId,
            @RequestParam("quantity") Integer quantity) {
        inventoryService.updateStock(productId, quantity);
        return ResponseEntity.ok().build();
    }

    //@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @PostMapping("/notify-out-of-stock/{orderId}")
    public ResponseEntity<Void> notifyOutOfStock(@PathVariable("orderId") Integer orderId) {
        inventoryService.notifyOutOfStock(orderId);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/products/export-request")
    public ResponseEntity<List<OrderProductInventoryDTO>> getProductsForExportRequest() {
        List<OrderProductInventoryDTO> result = inventoryService.getProductsForExportRequest();
        return ResponseEntity.ok(result);
    }
}