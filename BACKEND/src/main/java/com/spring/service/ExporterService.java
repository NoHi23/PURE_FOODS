 package com.spring.service;

import com.spring.dto.ExporterDTO;
import com.spring.dto.OrderRequestDTO;
import com.spring.entity.Order;
import com.spring.entity.OrderDetails;
import com.spring.entity.Products;
import com.spring.entity.User;

import java.util.List;

public interface ExporterService {
    ExporterDTO getExporterById(int id);
    Order createOrder(OrderRequestDTO orderRequest);
    List<Order> getOrdersByExporterId(int exporterId, int page, int size);
    void manageInventory(int exporterId, int productId, int quantity, String action);
    void exportFromInventory(int exporterId, int orderId, int productId, int quantity);
    List<OrderDetails> getTransactions(int exporterId, int page, int size);
    ExporterDTO updateProfile(int id, ExporterDTO exporterDTO);
    List<Order> searchOrders(String keyword, int page, int size);
    ExporterDTO authenticate(String email, String password);
}