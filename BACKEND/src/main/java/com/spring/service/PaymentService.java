package com.spring.service;

import com.spring.entity.Payments;
import com.spring.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.spring.service.NotificationService;
import com.spring.repository.OrderRepository;
import com.spring.entity.Orders;
import com.spring.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private NotificationService notificationService;
  public String checkPaymentStatus(Integer orderId) {
    // Lấy tất cả payment của orderId
    List<Payments> payments = paymentRepository.findAll()
        .stream()
        .filter(p -> p.getOrder() != null && orderId.equals(p.getOrder().getOrderId()))
        .sorted((a, b) -> b.getPaymentDate().compareTo(a.getPaymentDate()))
        .collect(Collectors.toList());
    if (!payments.isEmpty()) {
        return payments.get(0).getPaymentStatus();
    }
    return "Pending";
}
   public void requestPayment(Integer orderId) {
    Orders order = orderRepository.findByOrderId(orderId);
    if (order != null && order.getCustomer() != null) {
        String message = "Vui lòng thanh toán cho đơn hàng #OR00" + orderId;
        // Gửi notification với status "Sent"
        notificationService.sendNotification(orderId, message, "Sent");
    }
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