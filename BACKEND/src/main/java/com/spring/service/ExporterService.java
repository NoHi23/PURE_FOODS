package com.spring.service;

import com.spring.dto.ExporterDTO;
import com.spring.dto.TraderTransactionDTO;
import com.spring.entity.Exporter;
import com.spring.entity.Order;

import java.util.List;

public interface ExporterService {
    ExporterDTO getExporterById(int id);
    Order createOrder(Order order);
    List<Order> getOrdersByExporterId(int exporterId, int page, int size);
    void manageInventory(int exporterId, int productId, int quantity, String action);
    void exportFromInventory(int exporterId, int orderId, int productId, int quantity);
    List<TraderTransactionDTO> getTransactions(int exporterId, int page, int size);
    ExporterDTO updateProfile(int id, ExporterDTO exporterDTO);
    List<Order> searchOrders(String keyword, int page, int size);
    void deleteOrder(int orderId);
}