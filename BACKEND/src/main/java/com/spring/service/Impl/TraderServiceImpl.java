package com.spring.service.Impl;

import com.spring.dao.TraderDAO;
import com.spring.dto.TraderDTO;
import com.spring.dto.TraderTransactionDTO;
import com.spring.service.TraderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TraderServiceImpl implements TraderService {
    @Autowired
    private TraderDAO traderDAO;

    @Override
    public TraderDTO getTraderById(int id) {
        TraderDTO trader = traderDAO.getTraderById(id);
        if (trader == null) {
            throw new RuntimeException("Trader not found");
        }
        return trader;
    }

    @Override
    public List<TraderTransactionDTO> getTraderTransactions(int traderId) {
        return traderDAO.getTraderTransactions(traderId);
    }

    @Override
    public void recordTraderImport(int traderId, int supplierId, int productId, int quantity) {
        traderDAO.recordTraderImport(traderId, supplierId, productId, quantity);
    }

    @Override
    public void recordTraderSale(int traderId, int productId, int quantity, String orderId) {
        traderDAO.recordTraderSale(traderId, productId, quantity, orderId);
    }
}