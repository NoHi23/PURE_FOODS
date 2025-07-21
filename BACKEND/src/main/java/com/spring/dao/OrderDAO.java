package com.spring.dao;

import com.spring.entity.Order;
import java.util.List;

public interface OrderDAO {
    Order saveOrder(Order order); // Thêm phương thức
    void updateOrder(Order order); // Thêm phương thức
    void deleteOrder(int orderId);

    Order getOrderById(int orderId);
    List<Order> getAllOrders();
    List<Order> getOrdersByCustomerId(int customerId);
    List<Order> getOrdersByStatus(String status);
    List<Order> getOrdersByDriverId(int driverId);
    int countOrder();
}