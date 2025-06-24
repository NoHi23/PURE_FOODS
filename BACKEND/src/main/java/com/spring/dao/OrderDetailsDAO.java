package com.spring.dao;

import com.spring.entity.OrderDetails;

import java.util.List;

public interface OrderDetailsDAO {
    List<OrderDetails> getAllOrderDetails();
    OrderDetails getOrderDetailById(int id);
    OrderDetails addOrderDetail(OrderDetails orderDetail);
    OrderDetails updateOrderDetail(OrderDetails orderDetail);
    void deleteOrderDetail(int id);
    List<OrderDetails> getOrderDetailsByOrderId(int orderId);
    long countOrderDetails();
}