package com.spring.service;
import com.spring.dto.OrderDTO;

import java.util.List;

public interface OrderService {
    OrderDTO createOrder(OrderDTO orderDTO);
    OrderDTO getOrderById(int id);
    List<OrderDTO> getAllOrders();
    OrderDTO updateOrder(OrderDTO orderDTO);
    OrderDTO deleteOrder(int orderId);
    int getTotalOrders();
}