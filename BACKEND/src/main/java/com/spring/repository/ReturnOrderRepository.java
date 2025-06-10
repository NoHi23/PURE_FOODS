package com.spring.repository;

import com.spring.entity.ReturnOrders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReturnOrderRepository extends JpaRepository<ReturnOrders, Integer> {
List<ReturnOrders> findByOrder_OrderId(Integer orderId);
}