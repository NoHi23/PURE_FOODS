package com.spring.service;

import com.spring.entity.Payments;
import com.spring.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public String checkPaymentStatus(Integer orderId) {
        // Logic kiểm tra trạng thái thanh toán
        return "Pending"; // Placeholder
    }

    public void requestPayment(Integer orderId) {
        // Logic gửi thông báo yêu cầu thanh toán
    }

    public Payments processPayment(Integer orderId, Payments payment) {
        payment.setPaymentStatus("Processing");
        return paymentRepository.save(payment);
    }

    public Payments confirmPayment(Integer paymentId) {
        Optional<Payments> payment = paymentRepository.findById(paymentId);
        payment.ifPresent(p -> p.setPaymentStatus("Completed"));
        return payment.orElse(null);
    }

    public void refundPayment(Integer orderId) {
        // Logic hoàn tiền
    }
}