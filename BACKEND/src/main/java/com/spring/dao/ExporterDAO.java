package com.spring.dao;

import com.spring.dto.ExporterDTO;
import com.spring.entity.Orders;
import com.spring.entity.Products;
import com.spring.entity.Exporter;
import com.spring.dto.TraderTransactionDTO;

import java.util.List;

public interface ExporterDAO {
    Exporter getExporterById(int id);
    Orders createOrder(Orders order);
    List<Orders> getOrdersByExporterId(int exporterId, int page, int size);
    Products getProductById(int productId);
    void updateProduct(Products product);
    void deleteProduct(int productId);
    void exportFromInventory(int exporterId, int orderId, int productId, int quantity);
    List<TraderTransactionDTO> getTransactionsByExporterId(int exporterId, int page, int size);
    Exporter updateExporter(Exporter exporter);
    List<Orders> searchOrdersByKeyword(String keyword, int page, int size);
}