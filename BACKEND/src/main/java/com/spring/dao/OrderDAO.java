package com.spring.dao;

import com.spring.dto.BestSellingProductDTO;
import com.spring.entity.Order;
import com.spring.entity.Products;

import java.util.List;

public interface OrderDAO {
    void saveOrder(Order order);
    void updateOrder(Order order);
    void deleteOrder(int orderId);

    Order getOrderById(int orderId);
    List<Order> getAllOrders();
    List<Order> getOrdersByCustomerId(int customerId);
    List<Order> getOrdersByStatus(String status);
    List<Order> getOrdersByDriverId(int driverId);
    int countOrder();
    List<Order> getOrdersByStatusID(int statusID);
    List<BestSellingProductDTO> getTop5BestSellingProductsWithStats();
    List<Order> getTop5RecentOrders();

}
