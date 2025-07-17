package com.spring.dao;

import com.spring.dto.TraderTransactionDTO;
import com.spring.entity.Exporter;
import com.spring.entity.Order;
import com.spring.entity.Products;

import java.util.List;

public interface ExporterDAO {
    Exporter getExporterById(int id);
    Order createOrder(Order order);
    List<Order> getOrdersByExporterId(int exporterId, int page, int size);
    Products getProductById(int productId);
    void updateProduct(Products product);
    void deleteProduct(int productId);
    void exportFromInventory(int exporterId, int orderId, int productId, int quantity);
    List<TraderTransactionDTO> getTransactionsByExporterId(int exporterId, int page, int size);
    Exporter updateExporter(Exporter exporter);
    List<Order> searchOrdersByKeyword(String keyword, int page, int size);
    void deleteOrder(int orderId);
}