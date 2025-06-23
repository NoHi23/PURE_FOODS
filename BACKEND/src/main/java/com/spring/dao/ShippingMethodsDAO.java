package com.spring.dao;

import com.spring.entity.ShippingMethods;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ShippingMethodsDAO extends JpaRepository<ShippingMethods, Integer>{
}
