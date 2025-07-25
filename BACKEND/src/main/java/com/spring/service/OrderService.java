package com.spring.service;

import com.spring.dto.BestSellingProductDTO;
import com.spring.dto.OrderDTO;
import com.spring.entity.Order;
import com.spring.entity.Products;

import java.util.List;
import java.util.Map;

public interface OrderService {
    OrderDTO createOrder(OrderDTO orderDTO);
    OrderDTO confirmOrder(OrderDTO orderDTO);
    void deleteOrder(int orderId);
    OrderDTO getOrderById(int orderId);
    List<OrderDTO> getOrdersByCustomerId(int customerId);
    List<OrderDTO> getAllOrders();
    int countOrder();
    double calculateTotalRevenue();
    Map<Integer, Double> calculateMonthlyRevenue();
    List<BestSellingProductDTO> getTop5BestSellingProductsWithStats();
    List<Order> getTop5RecentOrders();
    void updateOrder(Order order);
    Order getOrderEntityById(int orderId);
    void decreaseProductQuantitiesByOrderId(int orderId);
    // Thêm method hasPurchased
    boolean hasCustomerBoughtProduct(int customerId, int productId);
}
