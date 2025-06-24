package com.spring.service;

import com.spring.dto.OrderDTO;
import com.spring.dto.SellerDTO;
import com.spring.entity.OrderDetails;
import com.spring.entity.Orders;
import com.spring.entity.Sellers;

import java.util.List;

public interface OrderService {
    Orders createOrder(Orders order, List<OrderDetails> orderDetailsList);
    List<OrderDTO> getOrdersBySellerId(int sellerId);
    List<OrderDetails> getOrderDetailsByOrderId(int orderId);
    Orders updateOrderStatus(int orderId, Integer statusId);
    SellerDTO getSellerProfile(int sellerId);
    Sellers updateSellerProfile(int sellerId, SellerDTO sellerDetails);
}
