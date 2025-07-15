package com.spring.dao;
import com.spring.entity.Order;

import java.util.List;

public interface OrderDAO {
    Order addOrder(Order order);
    Order findOrderById(int id);
    List<Order> getAllOrders();
    Order getOrderById(int id);
    Order updateOrder(Order order);
    void deleteOrder(int id);
    int countOrders();
}