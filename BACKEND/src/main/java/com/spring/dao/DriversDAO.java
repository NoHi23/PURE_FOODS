package com.spring.dao;

import com.spring.entity.Drivers;
import org.springframework.data.jpa.repository.JpaRepository;
public interface DriversDAO extends JpaRepository<Drivers, Integer>{
}
