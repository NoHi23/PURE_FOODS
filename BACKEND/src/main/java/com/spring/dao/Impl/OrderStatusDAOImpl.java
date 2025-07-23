package com.spring.dao.Impl;

import com.spring.dao.OrderStatusDAO;
import com.spring.entity.OrderStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
@Transactional
public class OrderStatusDAOImpl implements OrderStatusDAO {

    @PersistenceContext
    private EntityManager entityManager;

    public List<OrderStatus> findAll() {
        return entityManager.createQuery("FROM OrderStatus", OrderStatus.class).getResultList();
    }

    public OrderStatus findById(Integer id) {
        return entityManager.find(OrderStatus.class, id);
    }
}