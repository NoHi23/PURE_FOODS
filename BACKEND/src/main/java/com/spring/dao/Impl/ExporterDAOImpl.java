package com.spring.dao.Impl;

import com.spring.dao.ExporterDAO;
import com.spring.dto.OrderRequestDTO;
import com.spring.entity.Order;
import com.spring.entity.Products;
import com.spring.entity.User;
import com.spring.entity.InventoryLogs;
import com.spring.entity.OrderDetails;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;
import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ExporterDAOImpl implements ExporterDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public User getExporterById(int id) {
        try {
            Query query = entityManager.createQuery("SELECT u FROM User u WHERE u.userId = :id AND u.roleID = 5");
            query.setParameter("id", id);
            List<User> exporters = query.getResultList();
            return exporters.isEmpty() ? null : exporters.get(0);
        } catch (Exception e) {
            System.err.println("Error fetching exporter with ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @Override
    @Transactional
    public Order createOrder(OrderRequestDTO orderRequest) {
        try {
            System.out.println("Starting order creation with request: " + orderRequest);

            if (orderRequest.getCustomerID() == null) {
                throw new IllegalArgumentException("Customer ID cannot be null");
            }

            // Kiểm tra khách hàng
            Query customerQuery = entityManager.createQuery("SELECT u FROM User u WHERE u.userId = :customerId AND u.roleID = 2");
            customerQuery.setParameter("customerId", orderRequest.getCustomerID());
            List<User> customers = customerQuery.getResultList();
            if (customers.isEmpty()) {
                throw new IllegalArgumentException("Customer with ID " + orderRequest.getCustomerID() + " not found or roleID is not 2");
            }

            // Kiểm tra và tạo Order
            Order order = new Order();
            order.setCustomerID(orderRequest.getCustomerID());
            order.setShippingAddress(orderRequest.getShippingAddress());
            order.setOrderDate(new Timestamp(System.currentTimeMillis()));
            order.setStatus("Pending");
            order.setStatusID(1); // Pending
            entityManager.persist(order);
            entityManager.flush(); // Đảm bảo orderID được tạo
            System.out.println("Order created with ID: " + order.getOrderID());

            double totalAmount = 0.0;
            if (orderRequest.getItems() == null || orderRequest.getItems().isEmpty()) {
                throw new IllegalArgumentException("Order items cannot be null or empty");
            }

            for (OrderRequestDTO.OrderItem item : orderRequest.getItems()) {
                if (item.getProductId() == null || item.getQuantity() <= 0 || item.getUnitPrice() <= 0) {
                    throw new IllegalArgumentException("Invalid item data: productId=" + item.getProductId() + ", quantity=" + item.getQuantity() + ", unitPrice=" + item.getUnitPrice());
                }
                Products product = entityManager.find(Products.class, item.getProductId());
                if (product == null) {
                    throw new IllegalArgumentException("Product not found for ID: " + item.getProductId());
                }
                if (product.getStockQuantity() < item.getQuantity()) {
                    throw new IllegalArgumentException("Insufficient stock for product ID: " + item.getProductId() + ", available: " + product.getStockQuantity());
                }

                OrderDetails detail = new OrderDetails();
                detail.setOrderID(order.getOrderID());
                detail.setProductID(item.getProductId());
                detail.setQuantity(item.getQuantity());
                detail.setUnitPrice(BigDecimal.valueOf(item.getUnitPrice()));
                detail.setStatus(1); // Active
                entityManager.persist(detail);
                totalAmount += item.getQuantity() * item.getUnitPrice();
            }

            order.setTotalAmount(totalAmount);
            entityManager.merge(order);

            // Cập nhật thông tin khách hàng
            User customer = customers.get(0);
            customer.setFullName(orderRequest.getCustomerName());
            customer.setEmail(orderRequest.getEmail());
            customer.setPhone(orderRequest.getPhone());
            customer.setAddress(orderRequest.getShippingAddress());
            entityManager.merge(customer);

            return order;
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            throw new RuntimeException("Invalid input data: " + e.getMessage(), e);
        } catch (Exception e) {
            System.err.println("Database or system error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create order due to system error", e);
        }
    }

    @Override
    public List<Order> getOrdersByExporterId(int exporterId, int page, int size) {
        try {
            Query query = entityManager.createQuery("SELECT o FROM Order o WHERE o.statusID IN (6, 7)");
            query.setFirstResult(page * size);
            query.setMaxResults(size);
            return query.getResultList();
        } catch (Exception e) {
            System.err.println("Error fetching orders for exporter ID " + exporterId + ": " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public Products getProductById(int productId) {
        try {
            return entityManager.find(Products.class, productId);
        } catch (Exception e) {
            System.err.println("Error fetching product with ID " + productId + ": " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public void updateProduct(Products product) {
        try {
            if (product == null) {
                throw new IllegalArgumentException("Product cannot be null");
            }
            entityManager.merge(product);
        } catch (Exception e) {
            System.err.println("Error updating product: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public void deleteProduct(int productId) {
        try {
            Products product = entityManager.find(Products.class, productId);
            if (product != null) {
                entityManager.remove(product);
            }
        } catch (Exception e) {
            System.err.println("Error deleting product with ID " + productId + ": " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public void exportFromInventory(int exporterId, int orderId, int productId, int quantity) {
        try {
            Order order = entityManager.find(Order.class, orderId);
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

                    order.setStatusID(3); // Shipped
                    entityManager.merge(order);
                } else {
                    throw new IllegalArgumentException("Insufficient stock or invalid product/order");
                }
            } else {
                throw new IllegalArgumentException("Order not found or not in exportable state");
            }
        } catch (Exception e) {
            System.err.println("Error exporting from inventory for order ID " + orderId + ": " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<OrderDetails> getTransactionsByExporterId(int exporterId, int page, int size) {
        try {
            List<OrderDetails> transactions = new ArrayList<>();
            Query orderQuery = entityManager.createQuery("SELECT o FROM Order o WHERE o.statusID = 3");
            orderQuery.setFirstResult(page * size);
            orderQuery.setMaxResults(size);
            List<Order> orders = orderQuery.getResultList();
            for (Order order : orders) {
                List<OrderDetails> details = entityManager.createQuery(
                                "SELECT od FROM OrderDetails od WHERE od.orderID = :orderId", OrderDetails.class)
                        .setParameter("orderId", order.getOrderID())
                        .getResultList();
                transactions.addAll(details);
            }
            return transactions;
        } catch (Exception e) {
            System.err.println("Error fetching transactions for exporter ID " + exporterId + ": " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public User updateExporter(User exporter) {
        try {
            if (exporter == null || exporter.getUserId() <= 0) {
                throw new IllegalArgumentException("Invalid exporter data");
            }
            return entityManager.merge(exporter);
        } catch (Exception e) {
            System.err.println("Error updating exporter: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<Order> searchOrdersByKeyword(String keyword, int page, int size) {
        try {
            Query query = entityManager.createQuery(
                    "SELECT o FROM Order o WHERE o.shippingAddress LIKE :keyword AND o.statusID IN (6, 7)");
            query.setParameter("keyword", "%" + keyword + "%");
            query.setFirstResult(page * size);
            query.setMaxResults(size);
            return query.getResultList();
        } catch (Exception e) {
            System.err.println("Error searching orders with keyword " + keyword + ": " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public User authenticate(String email, String password) {
        try {
            Query query = entityManager.createQuery("SELECT u FROM User u WHERE u.email = :email AND u.roleID = 5");
            query.setParameter("email", email);
            List<User> exporters = query.getResultList();
            if (exporters.isEmpty()) {
                return null;
            }
            User exporter = exporters.get(0);
            if (exporter.getPassword().equals(password)) {
                return exporter;
            }
            return null;
        } catch (Exception e) {
            System.err.println("Error authenticating exporter with email " + email + ": " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}