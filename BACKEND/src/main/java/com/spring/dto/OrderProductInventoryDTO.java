package com.spring.dto;

import java.util.List;

public class OrderProductInventoryDTO {
    public Integer orderId;
    public Integer customerId; 
    public String customerName;
    public List<ProductInventoryDTO> products;

    public OrderProductInventoryDTO(Integer orderId, Integer customerId, String customerName, List<ProductInventoryDTO> products) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.products = products;
    }
}