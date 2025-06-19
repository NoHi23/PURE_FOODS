package com.spring.controller;

import com.spring.entity.Payments;
import com.spring.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    //@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @GetMapping("/status/{orderId}")
    public ResponseEntity<String> checkPaymentStatus(@PathVariable("orderId") Integer orderId) {
        String status = paymentService.checkPaymentStatus(orderId);
        return ResponseEntity.ok(status);
    }

    //@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @PostMapping("/request/{orderId}")
    public ResponseEntity<Void> requestPayment(@PathVariable("orderId") Integer orderId) {
        paymentService.requestPayment(orderId);
        return ResponseEntity.ok().build();
    }

    //@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @PostMapping("/process/{orderId}")
    public ResponseEntity<Payments> processPayment(@PathVariable("orderId") Integer orderId, @RequestBody Payments payment) {
        Payments processed = paymentService.processPayment(orderId, payment);
        return ResponseEntity.ok(processed);
    }

    //@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @PutMapping("/confirm/{paymentId}")
    public ResponseEntity<Payments> confirmPayment(@PathVariable("paymentId") Integer paymentId) {
        Payments payment = paymentService.confirmPayment(paymentId);
       if (payment != null) {
            return ResponseEntity.ok(payment);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @PostMapping("/refund/{orderId}")
    public ResponseEntity<Void> refundPayment(@PathVariable("orderId") Integer orderId) {
        paymentService.refundPayment(orderId);
        return ResponseEntity.ok().build();
    }
}