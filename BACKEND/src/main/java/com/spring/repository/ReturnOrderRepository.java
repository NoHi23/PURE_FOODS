package com.spring.repository;

import com.spring.entity.ReturnOrders;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReturnOrderRepository extends JpaRepository<ReturnOrders, Integer> {
}