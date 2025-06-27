package com.spring.service;

import com.spring.dto.TraderDTO;
import com.spring.dto.TraderTransactionDTO;
import java.util.List;

public interface TraderService {
    TraderDTO getTraderById(int id);
    List<TraderTransactionDTO> getTraderTransactions(int traderId);
    void recordTraderImport(int traderId, int supplierId, int productId, int quantity);
    void recordTraderSale(int traderId, int productId, int quantity, String orderId);
}