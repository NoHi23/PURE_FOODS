package com.spring.controller;

import com.spring.entity.ReturnOrders;
import com.spring.service.ReturnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/returns")
public class ReturnController {

    @Autowired
    private ReturnService returnService;

    //@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @PostMapping("/record/{orderId}")
    public ResponseEntity<ReturnOrders> recordReturn(
            @PathVariable("orderId") Integer orderId,
            @RequestParam("reason") String reason) {
        ReturnOrders returnOrder = returnService.recordReturn(orderId, reason);
        return ResponseEntity.ok(returnOrder);
    }

    //@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @PostMapping("/create/{orderId}")
    public ResponseEntity<ReturnOrders> createReturnOrder(@PathVariable("orderId") Integer orderId) {
        ReturnOrders returnOrder = returnService.createReturnOrder(orderId);
        return ResponseEntity.ok(returnOrder);
    }

    //@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @PutMapping("/update-inventory/{returnOrderId}")
    public ResponseEntity<Void> updateInventoryAfterReturn(@PathVariable("returnOrderId") Integer returnOrderId) {
        returnService.updateInventoryAfterReturn(returnOrderId);
        return ResponseEntity.ok().build();
    }
}