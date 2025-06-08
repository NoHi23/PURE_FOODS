package com.spring.dto;

import com.spring.entity.OrderDetails;
import com.spring.entity.Orders;

import java.util.List;

public class ExportRequestDTO {
    public Orders order;
    public List<OrderDetails> orderDetails;
}