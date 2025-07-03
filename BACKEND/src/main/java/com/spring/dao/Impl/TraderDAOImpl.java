package com.spring.dao.Impl;

import com.spring.dao.TraderDAO;
import com.spring.dto.TraderTransactionDTO;
import com.spring.entity.Orders;
import com.spring.entity.Products;
import com.spring.entity.Trader;
import com.spring.entity.InventoryLogs;
import com.spring.entity.Suppliers;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Repository
public class TraderDAOImpl implements TraderDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Trader getTraderById(int id) {
        Query query = entityManager.createQuery("SELECT t FROM Trader t WHERE t.userID = :id AND t.roleID = 3");
        query.setParameter("id", id);
        List<Trader> traders = query.getResultList();
        return traders.isEmpty() ? null : traders.get(0);
    }

    @Override
    public Orders createOrder(Orders order) {
        if (order.getCustomerID() == null) {
            throw new IllegalArgumentException("Customer ID cannot be null");
        }
        entityManager.persist(order);
        return order;
    }

    @Override
    public List<Orders> getOrdersByTraderId(int traderId) {
        Query query = entityManager.createQuery("SELECT o FROM Orders o WHERE o.customerID = :traderId");
        query.setParameter("traderId", traderId);
        return query.getResultList();
    }

    @Override
    public Products getProductById(int productId) {
        return entityManager.find(Products.class, productId);
    }

    @Override
    public void updateProduct(Products product) {
        if (product == null) {
            throw new IllegalArgumentException("Product cannot be null");
        }
        entityManager.merge(product);
    }

    @Override
    public void deleteProduct(int productId) {
        Products product = entityManager.find(Products.class, productId);
        if (product != null) {
            entityManager.remove(product);
        }
    }

    @Override
    public void importFromSupplier(int traderId, int supplierId, int productId, int quantity) {
        Products product = entityManager.find(Products.class, productId);
        if (product != null) {
            int newStock = product.getStockQuantity() + quantity;
            product.setStockQuantity(newStock);
            product.setLastUpdateBy(traderId);
            entityManager.merge(product);

            InventoryLogs log = new InventoryLogs(0, productId, traderId, quantity,
                    "Import from Supplier ID: " + supplierId, new Timestamp(System.currentTimeMillis()), 1);
            entityManager.persist(log);
        }
    }

    @Override
    public List<TraderTransactionDTO> getTransactionsByTraderId(int traderId) {
        List<TraderTransactionDTO> transactions = new ArrayList<>();

        Query orderQuery = entityManager.createQuery("SELECT o FROM Orders o WHERE o.customerID = :traderId");
        orderQuery.setParameter("traderId", traderId);
        List<Orders> orders = orderQuery.getResultList();
        for (Orders order : orders) {
            Products product = entityManager.find(Products.class, 1);
            if (product != null && order.getOrderDate() != null) {
                transactions.add(new TraderTransactionDTO(
                        order.getOrderID(),
                        1,
                        product.getProductName(),
                        1,
                        "sale",
                        null,
                        String.valueOf(order.getOrderID()),
                        order.getTotalAmount(),
                        order.getOrderDate()
                ));
            }
        }

        Query logQuery = entityManager.createQuery("SELECT l FROM InventoryLogs l WHERE l.userId = :traderId");
        logQuery.setParameter("traderId", traderId);
        List<InventoryLogs> logs = logQuery.getResultList();
        for (InventoryLogs log : logs) {
            Products product = entityManager.find(Products.class, log.getProductId());
            Suppliers supplier = entityManager.find(Suppliers.class, log.getUserId());
            if (product != null && log.getCreatedAt() != null) {
                BigDecimal amount = (product.getPrice() != 0) ?
                        BigDecimal.valueOf(product.getPrice()).multiply(BigDecimal.valueOf(log.getQuantityChange())) : BigDecimal.ZERO;
                String supplierName = supplier != null ? supplier.getSupplierName() : "Unknown";
                transactions.add(new TraderTransactionDTO(
                        log.getLogId(),
                        log.getProductId(),
                        product.getProductName(),
                        log.getQuantityChange(),
                        log.getQuantityChange() > 0 ? "import" : "export",
                        supplierName,
                        "N/A",
                        amount,
                        log.getCreatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime()
                ));
            }
        }

        return transactions;
    }
}