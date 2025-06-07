package com.spring.service;

import com.spring.entity.Orders;
import com.spring.entity.Products;
import com.spring.repository.OrderRepository;
import com.spring.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class InventoryService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;

    public Integer checkStock(Integer productId) {
        Optional<Products> product = productRepository.findById(productId);
        return product.map(Products::getStockQuantity).orElse(0);
    }

    public Orders confirmOrder(Integer orderId) {
        Optional<Orders> order = orderRepository.findById(orderId);
        if (order.isPresent()) {
            order.get().setStatus(null); // Set to Processing
            // Cập nhật kho (cần logic giảm StockQuantity)
            return orderRepository.save(order.get());
        }
        return null;
    }

    public Orders rejectOrder(Integer orderId, String reason) {
        Optional<Orders> order = orderRepository.findById(orderId);
        if (order.isPresent()) {
            order.get().setCancelReason(reason);
            order.get().setStatus(null); // Set to Cancelled
            return orderRepository.save(order.get());
        }
        return null;
    }

    public void updateStock(Integer productId, Integer quantity) {
        Optional<Products> product = productRepository.findById(productId);
        product.ifPresent(p -> {
            p.setStockQuantity(p.getStockQuantity() - quantity);
            productRepository.save(p);
        });
    }

    public void notifyOutOfStock(Integer orderId) {
        // Logic gửi thông báo (cần NotificationService)
    }
}