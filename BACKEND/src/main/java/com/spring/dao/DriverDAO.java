package com.spring.dao;

import com.spring.entity.Driver;
import java.util.List;

public interface DriverDAO {
    List<Driver> findAll();
    Driver findById(Long id);
    void save(Driver driver);
    void delete(Long id);
}