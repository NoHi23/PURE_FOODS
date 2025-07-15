package com.spring.service.Impl;

import com.spring.dao.OrderDAO;
import com.spring.dto.OrderDTO;
import com.spring.entity.Order;
import com.spring.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional(propagation = Propagation.REQUIRED)
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderDAO orderDAO;

    @Transactional(propagation = Propagation.REQUIRED)
    @Override
    public OrderDTO createOrder(OrderDTO orderDTO) {
        Order order = new Order();
        order.setCustomerID(orderDTO.getCustomerID());
        order.setOrderDate(Timestamp.valueOf(LocalDateTime.now()));
        order.setTotalAmount(orderDTO.getTotalAmount());
        order.setStatusID(orderDTO.getStatusID());
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setShippingMethodID(orderDTO.getShippingMethodID());
        order.setShippingCost(orderDTO.getShippingCost());
        order.setDistance(orderDTO.getDistance());
        order.setDiscountAmount(orderDTO.getDiscountAmount());
        order.setStatus(1);
        order.setEstimatedDeliveryDate(orderDTO.getEstimatedDeliveryDate());
        orderDAO.addOrder(order);
        return convertToDTO(order);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    @Override
    public OrderDTO getOrderById(int id) {
        Order order = orderDAO.getOrderById(id);
        if (order == null) {
            throw new RuntimeException("Order not found");
        }
        return convertToDTO(order);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    @Override
    public List<OrderDTO> getAllOrders() {
        List<Order> orderList = orderDAO.getAllOrders();
        if (orderList == null) {
            throw new RuntimeException("Orders not found!");
        }
        List<OrderDTO> orderDTOList = new ArrayList<>();
        for (Order order : orderList) {
            orderDTOList.add(convertToDTO(order));
        }
        return orderDTOList;
    }

    @Transactional(propagation = Propagation.REQUIRED)
    @Override
    public OrderDTO updateOrder(OrderDTO orderDTO) {
        Order order = orderDAO.getOrderById(orderDTO.getOrderId());
        if (order == null) {
            throw new RuntimeException("Order not found!");
        }
        order.setCustomerID(orderDTO.getCustomerID());
        order.setTotalAmount(orderDTO.getTotalAmount());
        order.setStatusID(orderDTO.getStatusID());
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setShippingMethodID(orderDTO.getShippingMethodID());
        order.setShippingCost(orderDTO.getShippingCost());
        order.setDistance(orderDTO.getDistance());
        order.setDiscountAmount(orderDTO.getDiscountAmount());
        order.setStatus(orderDTO.getStatus());
        order.setCancelReason(orderDTO.getCancelReason());
        order.setEstimatedDeliveryDate(orderDTO.getEstimatedDeliveryDate());
        order.setDelayReason(orderDTO.getDelayReason());
        order.setDriverID(orderDTO.getDriverID());
        order.setReturnReason(orderDTO.getReturnReason());
        orderDAO.updateOrder(order);
        return convertToDTO(order);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    @Override
    public OrderDTO deleteOrder(int orderId) {
        Order order = orderDAO.getOrderById(orderId);
        if (order == null) {
            throw new RuntimeException("Order not found!");
        }
        order.setStatus(0);
        orderDAO.updateOrder(order);
        return convertToDTO(order);
    }

    @Override
    public int getTotalOrders() {
        return orderDAO.countOrders();
    }

    private OrderDTO convertToDTO(Order order) {
        return new OrderDTO(
                order.getOrderId(),
                order.getCustomerID(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getStatusID(),
                order.getShippingAddress(),
                order.getShippingMethodID(),
                order.getShippingCost(),
                order.getDistance(),
                order.getDiscountAmount(),
                order.getStatus(),
                order.getCancelReason(),
                order.getEstimatedDeliveryDate(),
                order.getDelayReason(),
                order.getDriverID(),
                order.getReturnReason(),
                null
        );
    }
}