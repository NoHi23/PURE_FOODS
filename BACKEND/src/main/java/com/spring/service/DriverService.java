package com.spring.service;
import com.spring.entity.Driver;
import java.util.List;

public interface DriverService {
    List<Driver> findAll();
    Driver findById(Long id);
    void save(Driver driver);
    void delete(Long id);
}