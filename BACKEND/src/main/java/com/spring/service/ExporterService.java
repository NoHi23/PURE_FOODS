package com.spring.service;

import com.spring.dto.ExporterDTO;
import com.spring.entity.Orders;
import com.spring.entity.Products;
import com.spring.dto.TraderTransactionDTO;

import java.util.List;

public interface ExporterService {
    ExporterDTO getExporterById(int id);
    Orders createOrder(Orders order);
    List<Orders> getOrdersByExporterId(int exporterId, int page, int size);
    void manageInventory(int exporterId, int productId, int quantity, String action);
    void exportFromInventory(int exporterId, int orderId, int productId, int quantity);
    List<TraderTransactionDTO> getTransactions(int exporterId, int page, int size);
    ExporterDTO updateProfile(int id, ExporterDTO exporterDTO);
    List<Orders> searchOrders(String keyword, int page, int size);
}