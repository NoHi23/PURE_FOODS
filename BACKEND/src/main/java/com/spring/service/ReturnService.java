package com.spring.service;

import com.spring.entity.Orders;
import com.spring.entity.ReturnOrders;
import com.spring.repository.ReturnOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReturnService {

    @Autowired
    private ReturnOrderRepository returnOrderRepository;

    public ReturnOrders recordReturn(Integer orderId, String reason) {
        ReturnOrders returnOrder = new ReturnOrders();
        returnOrder.setOrder(new Orders(orderId));
        returnOrder.setReturnReason(reason);
        return returnOrderRepository.save(returnOrder);
    }

    public ReturnOrders createReturnOrder(Integer orderId) {
        ReturnOrders returnOrder = new ReturnOrders();
        returnOrder.setOrder(new Orders(orderId));
        return returnOrderRepository.save(returnOrder);
    }

    public void updateInventoryAfterReturn(Integer returnOrderId) {
        // Logic cập nhật kho
    }
}