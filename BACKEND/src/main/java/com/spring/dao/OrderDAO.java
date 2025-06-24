package com.spring.dao;

import com.spring.entity.Orders;

import java.util.List;

public interface OrderDAO {
    List<Orders> getAllOrders();
    Orders getOrderById(int id);
    Orders addOrder(Orders order);
    Orders updateOrder(Orders order);
    void deleteOrder(int id);
    List<Orders> getOrdersBySellerId(int sellerId);
    long countOrders();
}
