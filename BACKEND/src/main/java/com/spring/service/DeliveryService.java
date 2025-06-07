package com.spring.service;

import com.spring.entity.Drivers;
import com.spring.entity.Orders;
import com.spring.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DeliveryService {

    @Autowired
    private OrderRepository orderRepository;

    public Orders prepareDelivery(Integer orderId) {
        Optional<Orders> order = orderRepository.findById(orderId);
        order.ifPresent(o -> o.setStatus(null)); // Set to Shipped
        return order.orElse(null);
    }

    public Orders assignDriver(Integer orderId, Integer driverId) {
        Optional<Orders> order = orderRepository.findById(orderId);
        order.ifPresent(o -> o.setDriver(new Drivers(driverId))); // Set Driver
        return order.orElse(null);
    }

    public Orders updateDeliveryStatus(Integer orderId, String status) {
        Optional<Orders> order = orderRepository.findById(orderId);
        order.ifPresent(o -> o.setStatus(null)); // Update status
        return order.orElse(null);
    }

    public Orders confirmDelivery(Integer orderId) {
        Optional<Orders> order = orderRepository.findById(orderId);
        order.ifPresent(o -> o.setStatus(null)); // Set to Delivered
        return order.orElse(null);
    }

    public void notifyDelivery(Integer orderId) {
        // Logic gửi thông báo
    }
}