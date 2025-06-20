package com.spring.repository;

import com.spring.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.EntityGraph;
import java.util.List;

public interface OrderRepository extends JpaRepository<Orders, Integer> {
   @EntityGraph(attributePaths = {
        "orderDetails",
        "customer",
        "status",
        "shippingMethod",
        "driver"
    })
    List<Orders> findAll();

    @EntityGraph(attributePaths = {
        "orderDetails",
         "orderDetails.product", 
        "customer",
        "status",
        "shippingMethod",
        "driver"
    })
    Orders findByOrderId(Integer id);
}