package com.spring.service.Impl;

import com.spring.dao.OrderDetailDAO;
import com.spring.entity.OrderDetail;
import com.spring.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailServiceImpl implements OrderDetailService {

    @Autowired
    private OrderDetailDAO orderDetailDAO;

    @Override
    public OrderDetail createOrderDetail(OrderDetail orderDetail) {
        return orderDetailDAO.save(orderDetail);
    }
    @Override
    public List<OrderDetail> getByOrderID(int orderId) {
        return orderDetailDAO.findByOrderID(orderId);
    }
}
