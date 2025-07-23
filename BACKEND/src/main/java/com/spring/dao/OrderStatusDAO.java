package com.spring.dao;
import com.spring.entity.OrderStatus;
import java.util.List;

public interface OrderStatusDAO {
    List<OrderStatus> findAll();
    OrderStatus findById(Integer id);
}
