package com.spring.dao;

import com.spring.entity.Order;
import com.spring.entity.Products;
import com.spring.entity.Trader;
import com.spring.dto.TraderTransactionDTO;

import java.util.List;

public interface TraderDAO {
     Trader getTraderById(int id);
     Order createOrder(Order order);
     List<Order> getOrdersByTraderId(int traderId);
     Products getProductById(int productId);
     void updateProduct(Products product);
     void deleteProduct(int productId);
     void importFromSupplier(int traderId, int supplierId, int productId, int quantity);
     List<TraderTransactionDTO> getTransactionsByTraderId(int traderId);
}