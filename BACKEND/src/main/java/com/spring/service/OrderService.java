package com.spring.service;

import com.spring.dto.OrderDTO;
import java.util.List;

public interface OrderService {
    OrderDTO createOrder(OrderDTO orderDTO);
    OrderDTO confirmOrder(OrderDTO orderDTO);
    void deleteOrder(int orderId);
    OrderDTO getOrderById(int orderId);
    List<OrderDTO> getOrdersByCustomerId(int customerId);
    List<OrderDTO> getAllOrders();
}
