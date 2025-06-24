package com.spring.dao;

import com.spring.entity.OrderStatuses;
import org.springframework.data.jpa.repository.JpaRepository;
public interface OrderStatusesDAO extends JpaRepository<OrderStatuses, Integer>{
}
