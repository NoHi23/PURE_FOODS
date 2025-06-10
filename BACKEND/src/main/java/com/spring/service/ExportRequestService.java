package com.spring.service;

import com.spring.entity.OrderStatuses;
import com.spring.entity.Orders;
import com.spring.entity.OrderDetails;
import com.spring.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.sql.Timestamp;
@Service
public class ExportRequestService {

    @Autowired
    private OrderRepository orderRepository;

    public Orders createExportRequest(Orders order, List<OrderDetails> orderDetails) {
    // Đảm bảo orderDate không null
    if (order.getOrderDate() == null) {
        order.setOrderDate(new Timestamp(System.currentTimeMillis()));
    }
        if (order.getStatus() == null) {
        OrderStatuses pendingStatus = new OrderStatuses();
        pendingStatus.setStatusId(1); // 1 = Pending
        order.setStatus(pendingStatus);
    }
    Orders savedOrder = orderRepository.save(order);
    // Lưu orderDetails (cần repository OrderDetails)
    return savedOrder;
}
    public List<Orders> getAllExportRequests(String status) {
    // Logic lọc theo status nếu cần
    return orderRepository.findAll();
}

public Orders getExportRequestById(Integer id) {
    return orderRepository.findByOrderId(id);
}
    public Orders cancelExportRequest(Integer id, String cancelReason) {
    Optional<Orders> order = orderRepository.findById(id);
    if (order.isPresent() && !"Processing".equals(order.get().getStatus().getStatusName())) {
        order.get().setCancelReason(cancelReason);
        OrderStatuses cancelledStatus = new OrderStatuses();
        cancelledStatus.setStatusId(5); // 5 = Cancelled
        order.get().setStatus(cancelledStatus);
        return orderRepository.save(order.get());
    }
    return null;
}

public Orders receiveExportRequest(Orders order) {
    Orders dbOrder = orderRepository.findByOrderId(order.getOrderId());
    if (dbOrder == null) return null;
    OrderStatuses processingStatus = new OrderStatuses();
    processingStatus.setStatusId(2); // 2 = Processing
    dbOrder.setStatus(processingStatus);
    return orderRepository.save(dbOrder);
}
}