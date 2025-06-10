package com.spring.repository;

import com.spring.entity.OrderStatuses;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderStatusRepository extends JpaRepository<OrderStatuses, Integer> {
}