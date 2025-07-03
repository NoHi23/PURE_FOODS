package com.spring.service.Impl;

import com.spring.dao.TraderDAO;
import com.spring.dto.TraderDTO;
import com.spring.dto.TraderTransactionDTO;
import com.spring.entity.Orders;
import com.spring.entity.Products;
import com.spring.entity.Trader;
import com.spring.service.TraderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TraderServiceImpl implements TraderService {

    @Autowired
    private TraderDAO traderDAO;

    @Override
    public TraderDTO getTraderById(int id) {
        Trader trader = traderDAO.getTraderById(id);
        if (trader == null) return null;
        return new TraderDTO(
                trader.getUserID(), trader.getFullName(), trader.getEmail(),
                trader.getRoleID(), trader.getPhone(), trader.getAddress(),
                trader.getStatus(), trader.getCreatedAt()
        );
    }

    @Override
    public Orders createOrder(Orders order) {
        if (order.getCustomerID() == null) {
            throw new IllegalArgumentException("Customer ID cannot be null");
        }
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(1); // Pending
        return traderDAO.createOrder(order);
    }

    @Override
    public List<Orders> trackOrders(int traderId) {
        List<Orders> orders = traderDAO.getOrdersByTraderId(traderId);
        if (orders == null) return new ArrayList<>();
        return orders;
    }

    @Override
    public void manageInventory(int traderId, int productId, int quantity, String action) {
        Products product = traderDAO.getProductById(productId);
        if (product == null) throw new IllegalArgumentException("Product not found");

        if ("import".equalsIgnoreCase(action)) {
            traderDAO.importFromSupplier(traderId, traderId, productId, quantity);
        } else if ("update".equalsIgnoreCase(action)) {
            product.setStockQuantity(quantity);
            traderDAO.updateProduct(product);
        } else if ("delete".equalsIgnoreCase(action)) {
            traderDAO.deleteProduct(productId);
        }
    }

    @Override
    public void importFromSupplier(int traderId, int supplierId, int productId, int quantity) {
        traderDAO.importFromSupplier(traderId, supplierId, productId, quantity);
    }

    @Override
    public List<TraderTransactionDTO> getTransactions(int traderId) {
        List<TraderTransactionDTO> transactions = traderDAO.getTransactionsByTraderId(traderId);
        if (transactions == null) return new ArrayList<>();
        return transactions;
    }
}