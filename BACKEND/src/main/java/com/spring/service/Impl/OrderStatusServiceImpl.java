package com.spring.service.Impl;

import com.spring.dao.OrderStatusDAO;
import com.spring.entity.OrderStatus;
import com.spring.service.OrderStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class OrderStatusServiceImpl implements OrderStatusService {
    @Autowired
    private OrderStatusDAO orderStatusDAO;

    @Override
    @Transactional
    public OrderStatus getOrderStatusById(int statusID) {
        return orderStatusDAO.getOrderStatusById(statusID);
    }
}
