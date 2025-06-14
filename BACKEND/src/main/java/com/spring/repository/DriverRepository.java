package com.spring.repository;

import com.spring.entity.Drivers;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverRepository extends JpaRepository<Drivers, Integer> {
}