package com.spring.dao;

import com.spring.entity.OrderCancelRequest;

public interface OrderCancelRequestDAO {
    void save(OrderCancelRequest orderCancelRequest);
    OrderCancelRequest findByOrderId(int orderId);
    void update(OrderCancelRequest orderCancelRequest);
}