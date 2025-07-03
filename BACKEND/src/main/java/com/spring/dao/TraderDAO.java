package com.spring.dao;

import com.spring.entity.Orders;
import com.spring.entity.Products;
import com.spring.entity.Trader;
import com.spring.dto.TraderTransactionDTO;

import java.util.List;

public interface TraderDAO {
     Trader getTraderById(int id);
     Orders createOrder(Orders order);
     List<Orders> getOrdersByTraderId(int traderId);
     Products getProductById(int productId);
     void updateProduct(Products product);
     void deleteProduct(int productId);
     void importFromSupplier(int traderId, int supplierId, int productId, int quantity);
     List<TraderTransactionDTO> getTransactionsByTraderId(int traderId);
}