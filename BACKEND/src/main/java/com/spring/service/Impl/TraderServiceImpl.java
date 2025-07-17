package com.spring.service.Impl;

import com.spring.dao.TraderDAO;
import com.spring.dto.OrderDTO;
import com.spring.entity.Order;
import com.spring.service.TraderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional(propagation = Propagation.REQUIRED)
public class TraderServiceImpl implements TraderService {

    @Autowired
    private TraderDAO traderDAO;

    @Override
    public OrderDTO createOrder(OrderDTO orderDTO) {
        Order order = new Order();
        order.setCustomerID(orderDTO.getCustomerID());
        // Chuyển đổi LocalDateTime sang Date
        order.setOrderDate(Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant()));
        order.setTotalAmount(orderDTO.getTotalAmount());
        order.setStatusID(orderDTO.getStatusID());
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setShippingMethodID(orderDTO.getShippingMethodID());
        order.setShippingCost(orderDTO.getShippingCost());
        order.setDistance(orderDTO.getDistance());
        order.setDiscountAmount(orderDTO.getDiscountAmount());
        order.setStatus(String.valueOf(orderDTO.getStatusID())); // Chuyển int sang String cho status
        order.setEstimatedDeliveryDate(orderDTO.getEstimatedDeliveryDate());
        order.setDriverID(orderDTO.getDriverID());

        traderDAO.saveOrder(order);
        return convertToDTO(order);
    }

    @Override
    public OrderDTO confirmOrder(OrderDTO orderDTO) {
        Order order = traderDAO.getOrderById(orderDTO.getOrderID());
        if (order == null) {
            throw new IllegalArgumentException("Order not found!");
        }
        order.setStatus(String.valueOf(orderDTO.getStatusID())); // Chuyển int sang String
        order.setStatusID(orderDTO.getStatusID()); // Cập nhật statusID
        traderDAO.updateOrder(order);
        return convertToDTO(order);
    }

    @Override
    public void deleteOrder(int orderId) {
        Order order = traderDAO.getOrderById(orderId);
        if (order == null) {
            throw new IllegalArgumentException("Order not found!");
        }
        traderDAO.deleteOrder(orderId);
    }

    @Override
    public OrderDTO getOrderById(int orderId) {
        Order order = traderDAO.getOrderById(orderId);
        if (order == null) {
            throw new IllegalArgumentException("Order not found!");
        }
        return convertToDTO(order);
    }

    @Override
    public List<OrderDTO> getOrdersByCustomerId(int customerId) {
        List<Order> orders = traderDAO.getOrdersByCustomerId(customerId);
        List<OrderDTO> dtoList = new ArrayList<>();
        for (Order order : orders) {
            dtoList.add(convertToDTO(order));
        }
        return dtoList;
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        List<Order> orders = traderDAO.getAllOrders();
        List<OrderDTO> dtoList = new ArrayList<>();
        for (Order order : orders) {
            dtoList.add(convertToDTO(order));
        }
        return dtoList;
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderID(order.getOrderID());
        dto.setCustomerID(order.getCustomerID());
        dto.setOrderDate(order.getOrderDate());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatusID(order.getStatusID());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setShippingMethodID(order.getShippingMethodID());
        dto.setShippingCost(order.getShippingCost());
        dto.setDistance(order.getDistance());
        dto.setDiscountAmount(order.getDiscountAmount());
        dto.setStatus(order.getStatus());
        dto.setCancelReason(order.getCancelReason());
        dto.setEstimatedDeliveryDate(order.getEstimatedDeliveryDate());
        dto.setDelayReason(order.getDelayReason());
        dto.setDriverID(order.getDriverID());
        dto.setReturnReason(order.getReturnReason());
        return dto;
    }

    @Override
    public int countOrder() {
        return traderDAO.countOrder();
    }
}