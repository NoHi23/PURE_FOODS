package com.spring.dao.Impl;

import com.spring.dao.ExporterDAO;
import com.spring.dto.TraderTransactionDTO;
import com.spring.entity.Orders;
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
public class ExporterDAOImpl implements ExporterDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Exporter getExporterById(int id) {
        Query query = entityManager.createQuery("SELECT e FROM Exporter e WHERE e.userID = :id AND e.roleID = 4");
        query.setParameter("id", id);
        List<Exporter> exporters = query.getResultList();
        return exporters.isEmpty() ? null : exporters.get(0);
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
    public List<Orders> getOrdersByExporterId(int exporterId, int page, int size) {
        Query query = entityManager.createQuery("SELECT o FROM Orders o WHERE o.statusID IN (6, 7)");
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
    public void exportFromInventory(int exporterId, int orderId, int productId, int quantity) {
        Orders order = entityManager.find(Orders.class, orderId);
        if (order != null && order.getStatusID() != null && (order.getStatusID() == 6 || order.getStatusID() == 7)) {
            Products product = entityManager.find(Products.class, productId);
            if (product != null && product.getStockQuantity() >= quantity) {
                int newStock = product.getStockQuantity() - quantity;
                product.setStockQuantity(newStock);
                product.setLastUpdateBy(exporterId);
                entityManager.merge(product);

                InventoryLogs log = new InventoryLogs(0, productId, exporterId, -quantity,
                        "Export for Order ID: " + orderId, new Timestamp(System.currentTimeMillis()), 1);
                entityManager.persist(log);

                order.setStatusID(3);
                entityManager.merge(order);
            }
        }
    }

    @Override
    public List<TraderTransactionDTO> getTransactionsByExporterId(int exporterId, int page, int size) {
        List<TraderTransactionDTO> transactions = new ArrayList<>();

        Query orderQuery = entityManager.createQuery("SELECT o FROM Orders o WHERE o.statusID = 3");
        orderQuery.setFirstResult(page * size);
        orderQuery.setMaxResults(size);
        List<Orders> orders = orderQuery.getResultList();
        for (Orders order : orders) {
            List<OrderDetails> details = entityManager.createQuery("SELECT od FROM OrderDetails od WHERE od.orderID = :orderId", OrderDetails.class)
                    .setParameter("orderId", order.getOrderID())
                    .getResultList();
            for (OrderDetails detail : details) {
                Products product = entityManager.find(Products.class, detail.getProductID());
                if (product != null) {
                    transactions.add(new TraderTransactionDTO(
                            order.getOrderID(),
                            detail.getProductID(),
                            product.getProductName(),
                            detail.getQuantity(),
                            "export",
                            null,
                            String.valueOf(order.getOrderID()),
                            detail.getUnitPrice().multiply(BigDecimal.valueOf(detail.getQuantity())),
                            order.getOrderDate()
                    ));
                }
            }
        }

        Query logQuery = entityManager.createQuery("SELECT l FROM InventoryLogs l WHERE l.userId = :exporterId AND l.quantityChange < 0");
        logQuery.setParameter("exporterId", exporterId);
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
    public List<Orders> searchOrdersByKeyword(String keyword, int page, int size) {
        Query query = entityManager.createQuery(
                "SELECT o FROM Orders o WHERE o.shippingAddress LIKE :keyword AND o.statusID IN (6, 7)");
        query.setParameter("keyword", "%" + keyword + "%");
        query.setFirstResult(page * size);
        query.setMaxResults(size);
        return query.getResultList();
    }
}