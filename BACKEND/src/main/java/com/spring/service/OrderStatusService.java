package com.spring.service;


import com.spring.entity.OrderStatus;

import java.util.Optional;

public interface OrderStatusService {
    OrderStatus getOrderStatusById(int statusID);
    Optional<OrderStatus> findById(Integer id);

}
