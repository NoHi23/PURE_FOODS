package com.spring.service.Impl;
import com.spring.dao.DriverDAO;
import com.spring.entity.Driver;
import com.spring.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DriverServiceImpl implements DriverService {

    @Autowired
    private DriverDAO driverDAO;

    public List<Driver> findAll() {
        return driverDAO.findAll();
    }

    public Driver findById(Long id) {
        return driverDAO.findById(id);
    }

    public void save(Driver driver) {
        driverDAO.save(driver);
    }

    public void delete(Long id) {
        driverDAO.delete(id);
    }
}