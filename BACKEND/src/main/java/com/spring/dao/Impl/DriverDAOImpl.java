package com.spring.dao.Impl;

import com.spring.dao.DriverDAO;
import com.spring.entity.Driver;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public class DriverDAOImpl implements DriverDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Driver> findAll() {
        return entityManager.createQuery("FROM Driver", Driver.class).getResultList();
    }

    @Override
    public Driver findById(Long id) {
        return entityManager.find(Driver.class, id);
    }

    @Override
    public void save(Driver driver) {
        entityManager.merge(driver);
    }

    @Override
    public void delete(Long id) {
        Driver driver = findById(id);
        if (driver != null) entityManager.remove(driver);
    }
}