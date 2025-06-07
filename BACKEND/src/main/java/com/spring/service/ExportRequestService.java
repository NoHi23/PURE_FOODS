package com.spring.service;

import com.spring.entity.Orders;
import com.spring.entity.OrderDetails;
import com.spring.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExportRequestService {

    @Autowired
    private OrderRepository orderRepository;

    public Orders createExportRequest(Orders order, List<OrderDetails> orderDetails) {
        // Logic kiểm tra tồn kho và lưu order
        order.setStatus(null); // Set status Pending
        Orders savedOrder = orderRepository.save(order);
        // Lưu orderDetails (cần repository OrderDetails)
        return savedOrder;
    }

    public List<Orders> getAllExportRequests(String status) {
        // Logic lọc theo status
        return orderRepository.findAll();
    }

    public Orders getExportRequestById(Integer id) {
        Optional<Orders> order = orderRepository.findById(id);
        return order.orElse(null);
    }

    public Orders cancelExportRequest(Integer id, String cancelReason) {
        Optional<Orders> order = orderRepository.findById(id);
        if (order.isPresent() && !"Processing".equals(order.get().getStatus().getStatusName())) {
            order.get().setCancelReason(cancelReason);
            order.get().setStatus(null); // Set status Cancelled
            return orderRepository.save(order.get());
        }
        return null;
    }

    public Orders receiveExportRequest(Orders order) {
        // Logic nhận yêu cầu (giống create nhưng có thể thêm validation)
        return orderRepository.save(order);
    }
}