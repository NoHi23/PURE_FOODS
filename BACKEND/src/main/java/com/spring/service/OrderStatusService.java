package com.spring.service;
import com.spring.entity.OrderStatus;
import java.util.List;

public interface OrderStatusService {
    List<OrderStatus> findAll();
    OrderStatus findById(Integer id);
}