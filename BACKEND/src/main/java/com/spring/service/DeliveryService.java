package com.spring.service;

import com.spring.entity.Drivers;
import com.spring.entity.Orders;
import com.spring.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.spring.entity.OrderStatuses;
import java.sql.Timestamp;
import java.util.Optional;

@Service
public class DeliveryService {

    @Autowired
    private OrderRepository orderRepository;

   public Orders prepareDelivery(Integer orderId, Timestamp estimatedDeliveryDate) {
    Orders order = orderRepository.findByOrderId(orderId);
    if (order != null) {
        OrderStatuses readyToShipStatus = new OrderStatuses();
        readyToShipStatus.setStatusId(7); // 7 = ReadyToShip
        order.setStatus(readyToShipStatus);
        order.setEstimatedDeliveryDate(estimatedDeliveryDate); 
        orderRepository.save(order);
    }
    return order;
}
public Orders assignDriver(Integer orderId, Integer driverId) {
    Orders order = orderRepository.findByOrderId(orderId); 
    if (order != null) {
        order.setDriver(new Drivers(driverId));
        OrderStatuses shippedStatus = new OrderStatuses();
        shippedStatus.setStatusId(3); // 3 = Shipped
        order.setStatus(shippedStatus);
        orderRepository.save(order);
    }
    return order;
}

    public Orders updateDeliveryStatus(Integer orderId, String status) {
    Orders order = orderRepository.findByOrderId(orderId); 
    if (order != null) {
        OrderStatuses newStatus = new OrderStatuses();
        switch (status.toLowerCase()) {
            case "pending": newStatus.setStatusId(1); break;
            case "processing": newStatus.setStatusId(2); break;
            case "shipped": newStatus.setStatusId(3); break;
            case "delivered": newStatus.setStatusId(4); break;
            case "cancelled": newStatus.setStatusId(5); break;
            case "confirm": newStatus.setStatusId(6); break;
            case "readytoship": newStatus.setStatusId(7); break;
            default: newStatus.setStatusId(1);
        }
        order.setStatus(newStatus);
        orderRepository.save(order);
    }
    return order;
}


public Orders confirmDelivery(Integer orderId, String delayReason) {
    Orders order = orderRepository.findByOrderId(orderId); 
    if (order != null) {
        OrderStatuses deliveredStatus = new OrderStatuses();
        deliveredStatus.setStatusId(4); // 4 = Delivered
        order.setStatus(deliveredStatus);
        order.setDelayReason(delayReason); 
        orderRepository.save(order);
    }
    return order;
}

    public void notifyDelivery(Integer orderId) {
        // Logic gửi thông báo
    }
}