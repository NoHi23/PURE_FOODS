package com.spring.service.impl;
import com.spring.dao.OrderStatusDAO;
import com.spring.entity.OrderStatus;
import com.spring.service.OrderStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderStatusServiceImpl implements OrderStatusService {

    @Autowired
    private OrderStatusDAO orderStatusDAO;

    public List<OrderStatus> findAll() {
        return orderStatusDAO.findAll();
    }

    public OrderStatus findById(Integer id) {
        return orderStatusDAO.findById(id);
    }
}