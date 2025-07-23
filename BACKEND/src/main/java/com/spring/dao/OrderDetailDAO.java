package com.spring.dao;

import com.spring.entity.OrderDetail;

import java.util.List;

public interface OrderDetailDAO {
    OrderDetail save(OrderDetail orderDetail);
    List<OrderDetail> findByOrderID(int orderId);

}