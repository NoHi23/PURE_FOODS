package com.spring.dao;

import com.spring.dto.OrderRequestDTO;
import com.spring.entity.Order;
import com.spring.entity.OrderDetails;
import com.spring.entity.Products;
import com.spring.entity.User;

import java.util.List;

public interface ExporterDAO {
    User getExporterById(int id);
    Order createOrder(OrderRequestDTO orderRequest);
    List<Order> getOrdersByExporterId(int exporterId, int page, int size);
    Products getProductById(int productId);
    void updateProduct(Products product);
    void deleteProduct(int productId);
    void exportFromInventory(int exporterId, int orderId, int productId, int quantity);
    List<OrderDetails> getTransactionsByExporterId(int exporterId, int page, int size);
    User updateExporter(User exporter);
    List<Order> searchOrdersByKeyword(String keyword, int page, int size);
    User authenticate(String email, String password);
}