package com.spring.controller;

import com.spring.entity.ReturnOrders;
import com.spring.service.ReturnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.spring.dto.ReturnOrderResponseDTO;
import java.util.List;

@RestController
@RequestMapping("/api/returns")
public class ReturnController {

    @Autowired
    private ReturnService returnService;

    //@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @PostMapping("/record/{orderId}")
    public ResponseEntity<?> recordReturn(
            @PathVariable("orderId") Integer orderId,
            @RequestParam("reason") String reason,
            @RequestParam("processBy") Integer processBy) {
        ReturnOrders returnOrder = returnService.recordReturn(orderId, reason, processBy);
        if (returnOrder == null) {
            return ResponseEntity.badRequest().header("Content-Type", "text/plain; charset=UTF-8").body("Đơn hàng này đã được trả hàng trước đó!");
        }
        return ResponseEntity.ok(returnOrder);
    }

    @PostMapping("/create/{orderId}")
    public ResponseEntity<?> createReturnOrder(
            @PathVariable("orderId") Integer orderId,
            @RequestParam("processBy") Integer processBy) {
        ReturnOrders returnOrder = returnService.createReturnOrder(orderId, processBy);
        if (returnOrder == null) {
            return ResponseEntity.badRequest().header("Content-Type", "text/plain; charset=UTF-8").body("Đơn hàng này đã được trả hàng trước đó!");
        }
        return ResponseEntity.ok(returnOrder);
    }

    //@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @PutMapping("/update-inventory/{returnOrderId}")
    public ResponseEntity<Void> updateInventoryAfterReturn(@PathVariable("returnOrderId") Integer returnOrderId) {
        returnService.updateInventoryAfterReturn(returnOrderId);
        // return ResponseEntity.ok().build();
        // trả về 204 No Content
        return ResponseEntity.noContent().build();
    }

 @GetMapping("/list")
public ResponseEntity<List<ReturnOrderResponseDTO>> getAllReturns() {
    List<ReturnOrderResponseDTO> list = returnService.getAllReturnDTOs();
    return ResponseEntity.ok(list);
}

    // Sửa lý do trả hàng
     @PutMapping("/edit-reason/{returnOrderId}")
    public ResponseEntity<?> editReturnReason(
            @PathVariable("returnOrderId") Integer returnOrderId,
            @RequestParam("reason") String reason) {
        ReturnOrders updated = returnService.editReturnReason(returnOrderId, reason);
        if (updated != null) {
            ReturnOrderResponseDTO response = new ReturnOrderResponseDTO();
            response.returnOrderId = updated.getReturnOrderId();
            response.orderId = updated.getOrder().getOrderId();
            response.customerName = updated.getOrder().getCustomer().getFullName();
            response.returnDate = updated.getReturnDate();
            response.returnReason = updated.getReturnReason();
            response.statusName = updated.getStatus().getStatusName();
            response.processedByName = updated.getProcessedBy() != null ? updated.getProcessedBy().getFullName() : "N/A";
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().header("Content-Type", "text/plain; charset=UTF-8").body("Không tìm thấy đơn hàng trả hàng với ID: " + returnOrderId);
        }
    }
}