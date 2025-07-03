package com.spring.service;

import com.spring.dto.TraderDTO;
import com.spring.entity.Orders;
import com.spring.entity.Products;
import com.spring.dto.TraderTransactionDTO;

import java.util.List;

public interface TraderService {
    TraderDTO getTraderById(int id);
    Orders createOrder(Orders order);
    List<Orders> trackOrders(int traderId);
    void manageInventory(int traderId, int productId, int quantity, String action);
    void importFromSupplier(int traderId, int supplierId, int productId, int quantity);
    List<TraderTransactionDTO> getTransactions(int traderId);
}