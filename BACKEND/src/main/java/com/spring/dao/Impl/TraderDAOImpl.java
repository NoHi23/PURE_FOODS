package com.spring.dao.Impl;

import com.spring.dao.TraderDAO;
import com.spring.dto.TraderTransactionDTO;
import com.spring.entity.Order;
import com.spring.entity.Products;
import com.spring.entity.Exporter;
import com.spring.entity.InventoryLogs;
import com.spring.entity.OrderDetails;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class TraderDAOImpl implements TraderDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Exporter getTraderById(int id) {
        Query query = entityManager.createQuery("SELECT e FROM Exporter e WHERE e.userID = :id AND e.roleID = 4");
        query.setParameter("id", id);
        List<Exporter> traders = query.getResultList();
        return traders.isEmpty() ? null : traders.get(0);
    }

    @Override
    public Order createOrder(Order order) {
        if (order.getCustomerID() == null) {
            throw new IllegalArgumentException("Customer ID cannot be null");
        }
        try {
            entityManager.persist(order);
            entityManager.flush();
            return order;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Order> getOrdersByTraderId(int traderId, int page, int size) {
        Query query = entityManager.createQuery("SELECT o FROM Order o WHERE o.customerID = :customerId AND o.statusID IN (6, 7)");
        query.setParameter("customerId", traderId);
        query.setFirstResult(page * size);
        query.setMaxResults(size);
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
    public void exportFromInventory(int traderId, int orderId, int productId, int quantity) {
        Order order = entityManager.find(Order.class, orderId);
        if (order != null && order.getStatusID() != null && (order.getStatusID() == 6 || order.getStatusID() == 7)) {
            Products product = entityManager.find(Products.class, productId);
            if (product != null && product.getStockQuantity() >= quantity) {
                int newStock = product.getStockQuantity() - quantity;
                product.setStockQuantity(newStock);
                product.setLastUpdateBy(traderId);
                entityManager.merge(product);

                InventoryLogs log = new InventoryLogs(0, productId, traderId, -quantity,
                        "Export for Order ID: " + orderId, new Timestamp(System.currentTimeMillis()), 1);
                entityManager.persist(log);

                order.setStatusID(3);
                entityManager.merge(order);
            }
        }
    }

    @Override
    public List<TraderTransactionDTO> getTransactionsByTraderId(int traderId, int page, int size) {
        List<TraderTransactionDTO> transactions = new ArrayList<>();

        Query orderQuery = entityManager.createQuery("SELECT o FROM Order o WHERE o.statusID = 3");
        orderQuery.setFirstResult(page * size);
        orderQuery.setMaxResults(size);
        List<Order> orders = orderQuery.getResultList();
        for (Order orderItem : orders) { // Đổi tên biến order thành orderItem để tránh xung đột
            List<OrderDetails> details = entityManager.createQuery("SELECT od FROM OrderDetails od WHERE od.orderID = :orderId", OrderDetails.class)
                    .setParameter("orderId", orderItem.getOrderID())
                    .getResultList();
            for (OrderDetails detail : details) {
                Products product = entityManager.find(Products.class, detail.getProductID());
                if (product != null) {
                    transactions.add(new TraderTransactionDTO(
                            orderItem.getOrderID(),
                            detail.getProductID(),
                            product.getProductName(),
                            detail.getQuantity(),
                            "export",
                            null,
                            String.valueOf(orderItem.getOrderID()),
                            // Chuyển đổi Double sang BigDecimal
                            BigDecimal.valueOf(orderItem.getTotalAmount() != null ? orderItem.getTotalAmount() : 0.0),
                            orderItem.getOrderDate()
                    ));
                }
            }
        }

        Query logQuery = entityManager.createQuery("SELECT l FROM InventoryLogs l WHERE l.userId = :traderId AND l.quantityChange < 0");
        logQuery.setParameter("traderId", traderId);
        logQuery.setFirstResult(page * size);
        logQuery.setMaxResults(size);
        List<InventoryLogs> logs = logQuery.getResultList();
        for (InventoryLogs log : logs) {
            Products product = entityManager.find(Products.class, log.getProductId());
            if (product != null && log.getCreatedAt() != null) {
                BigDecimal amount = BigDecimal.valueOf(product.getPrice()).multiply(BigDecimal.valueOf(log.getQuantityChange() * -1));
                transactions.add(new TraderTransactionDTO(
                        log.getLogId(),
                        log.getProductId(),
                        product.getProductName(),
                        log.getQuantityChange() * -1,
                        "export",
                        "Unknown",
                        "N/A",
                        amount,
                        log.getCreatedAt().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime()
                ));
            }
        }

        return transactions;
    }

    @Override
    public Exporter updateExporter(Exporter exporter) {
        if (exporter == null || exporter.getUserID() <= 0) {
            throw new IllegalArgumentException("Invalid exporter data");
        }
        return entityManager.merge(exporter);
    }

    @Override
    public List<Order> searchOrdersByKeyword(String keyword, int page, int size) {
        Query query = entityManager.createQuery(
                "SELECT o FROM Order o WHERE o.shippingAddress LIKE :keyword AND o.statusID IN (6, 7)");
        query.setParameter("keyword", "%" + keyword + "%");
        query.setFirstResult(page * size);
        query.setMaxResults(size);
        return query.getResultList();
    }

    @Override
    public void deleteOrder(int orderId) {
        Order order = entityManager.find(Order.class, orderId);
        if (order != null) {
            entityManager.remove(order);
        }
    }
}