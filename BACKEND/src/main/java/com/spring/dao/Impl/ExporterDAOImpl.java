package com.spring.dao.Impl;

import com.spring.dao.ExporterDAO;
import com.spring.entity.Exporter;
import com.spring.entity.ExporterDetail;
import com.spring.entity.ExporterHistory;
import com.spring.entity.Products;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public class ExporterDAOImpl implements ExporterDAO {

    private static final Logger logger = LoggerFactory.getLogger(ExporterDAOImpl.class);

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public Exporter getExporterById(Long id) {
        try {
            logger.info("Fetching exporter with ID: {}", id);
            Session session = sessionFactory.getCurrentSession();
            Exporter exporter = session.get(Exporter.class, id);
            if (exporter == null) {
                logger.warn("Exporter not found with ID: {}", id);
                throw new RuntimeException("Exporter not found: " + id);
            }
            return exporter;
        } catch (Exception e) {
            logger.error("Error fetching exporter ID {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to fetch exporter: " + id, e);
        }
    }

    @Override
    public List<Exporter> getAllExporters() {
        try {
            logger.info("Fetching all exporters");
            Session session = sessionFactory.getCurrentSession();
            return session.createQuery("FROM Exporter WHERE status = 1", Exporter.class).getResultList();
        } catch (Exception e) {
            logger.error("Error fetching all exporters: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch exporters", e);
        }
    }

    @Override
    public List<Exporter> searchExporters(String keyword) {
        try {
            logger.info("Searching exporters with keyword: {}", keyword);
            Session session = sessionFactory.getCurrentSession();
            Query<Exporter> query = session.createQuery(
                    "FROM Exporter WHERE (customerName LIKE :keyword OR shippingAddress LIKE :keyword OR email LIKE :keyword) AND status = 1", Exporter.class);
            query.setParameter("keyword", "%" + keyword + "%");
            return query.getResultList();
        } catch (Exception e) {
            logger.error("Error searching exporters with keyword {}: {}", keyword, e.getMessage());
            throw new RuntimeException("Failed to search exporters", e);
        }
    }

    @Override
    public Exporter createExporter(Exporter exporter) {
        try {
            logger.info("Creating exporter for userId: {}", exporter.getUserId());
            Session session = sessionFactory.getCurrentSession();
            session.persist(exporter);
            session.flush(); // Ensure ID is generated
            return exporter;
        } catch (Exception e) {
            logger.error("Failed to create exporter: {}", e.getMessage());
            throw new RuntimeException("Failed to create exporter", e);
        }
    }

    @Override
    public Exporter updateExporter(Exporter exporter) {
        try {
            logger.info("Updating exporter ID: {}", exporter.getExporterId());
            Session session = sessionFactory.getCurrentSession();
            session.merge(exporter);
            return exporter;
        } catch (Exception e) {
            logger.error("Failed to update exporter ID {}: {}", exporter.getExporterId(), e.getMessage());
            throw new RuntimeException("Failed to update exporter", e);
        }
    }

    @Override
    public void updateStatus(Long id, Integer statusId) {
        try {
            logger.info("Updating status for exporter ID: {}", id);
            if (statusId == null || statusId < 1 || statusId > 5) {
                throw new IllegalArgumentException("Invalid statusId: " + statusId);
            }
            Session session = sessionFactory.getCurrentSession();
            Exporter exporter = session.get(Exporter.class, id);
            if (exporter == null) {
                throw new RuntimeException("Exporter not found: " + id);
            }
            exporter.setStatusId(statusId);
            session.merge(exporter);
        } catch (Exception e) {
            logger.error("Failed to update status for exporter ID {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to update status: " + id, e);
        }
    }

    @Override
    public void confirmOrder(Long id) {
        try {
            logger.info("Confirming order for exporter ID: {}", id);
            Session session = sessionFactory.getCurrentSession();
            Exporter exporter = session.get(Exporter.class, id);
            if (exporter == null) {
                throw new RuntimeException("Exporter not found: " + id);
            }
            exporter.setStatusId(3); // Shipped
            session.merge(exporter);
        } catch (Exception e) {
            logger.error("Failed to confirm order for exporter ID {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to confirm order: " + id, e);
        }
    }

    @Override
    public void rejectOrder(Long id, String reason) {
        try {
            logger.info("Rejecting order for exporter ID: {}", id);
            if (reason == null || reason.trim().isEmpty()) {
                throw new IllegalArgumentException("Reject reason cannot be empty");
            }
            Session session = sessionFactory.getCurrentSession();
            Exporter exporter = session.get(Exporter.class, id);
            if (exporter == null) {
                throw new RuntimeException("Exporter not found: " + id);
            }
            exporter.setStatusId(5); // Cancelled
            exporter.setCancelReason(reason);
            session.merge(exporter);
        } catch (Exception e) {
            logger.error("Failed to reject order for exporter ID {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to reject order: " + id, e);
        }
    }

    @Override
    public void returnOrder(Long id, String returnReason) {
        try {
            logger.info("Returning order for exporter ID: {}", id);
            if (returnReason == null || returnReason.trim().isEmpty()) {
                throw new IllegalArgumentException("Return reason cannot be empty");
            }
            Session session = sessionFactory.getCurrentSession();
            Exporter exporter = session.get(Exporter.class, id);
            if (exporter == null) {
                throw new RuntimeException("Exporter not found: " + id);
            }
            exporter.setStatusId(5); // Cancelled
            exporter.setReturnReason(returnReason);
            session.merge(exporter);
        } catch (Exception e) {
            logger.error("Failed to return order for exporter ID {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to return order: " + id, e);
        }
    }

    @Override
    public void updateStock(Long exporterId, Long productId, Integer quantity, String action) {
        try {
            logger.info("Updating stock for exporter ID: {}, productId: {}", exporterId, productId);
            if (quantity < 0) {
                throw new IllegalArgumentException("Quantity cannot be negative");
            }
            if (!"update".equalsIgnoreCase(action) && !"delete".equalsIgnoreCase(action)) {
                throw new IllegalArgumentException("Invalid action: " + action);
            }
            Session session = sessionFactory.getCurrentSession();
            Products product = session.get(Products.class, productId.intValue());
            if (product == null) {
                throw new RuntimeException("Product not found: " + productId);
            }
            if ("update".equalsIgnoreCase(action)) {
                product.setStockQuantity(quantity);
            } else {
                product.setStockQuantity(0);
            }
            session.merge(product);
        } catch (Exception e) {
            logger.error("Failed to update stock for productId {}: {}", productId, e.getMessage());
            throw new RuntimeException("Failed to update stock: " + productId, e);
        }
    }

    @Override
    public void confirmDelivery(Long id) {
        try {
            logger.info("Confirming delivery for exporter ID: {}", id);
            Session session = sessionFactory.getCurrentSession();
            Exporter exporter = session.get(Exporter.class, id);
            if (exporter == null) {
                throw new RuntimeException("Exporter not found: " + id);
            }
            exporter.setStatusId(4); // Delivered
            session.merge(exporter);
        } catch (Exception e) {
            logger.error("Failed to confirm delivery for exporter ID {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to confirm delivery: " + id, e);
        }
    }

    @Override
    public void driverConfirmDelivery(Long id) {
        try {
            logger.info("Driver confirming delivery for exporter ID: {}", id);
            Session session = sessionFactory.getCurrentSession();
            Exporter exporter = session.get(Exporter.class, id);
            if (exporter == null) {
                throw new RuntimeException("Exporter not found: " + id);
            }
            exporter.setStatusId(4); // Delivered
            session.merge(exporter);
        } catch (Exception e) {
            logger.error("Failed to driver confirm delivery for exporter ID {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to driver confirm delivery: " + id, e);
        }
    }

    @Override
    public void updateDeliverySchedule(Long id, String estimatedDeliveryDate) {
        try {
            logger.info("Updating delivery schedule for exporter ID: {}", id);
            if (estimatedDeliveryDate == null || estimatedDeliveryDate.trim().isEmpty()) {
                throw new IllegalArgumentException("Estimated delivery date cannot be empty");
            }
            Session session = sessionFactory.getCurrentSession();
            Exporter exporter = session.get(Exporter.class, id);
            if (exporter == null) {
                throw new RuntimeException("Exporter not found: " + id);
            }
            exporter.setEstimatedDeliveryDate(LocalDateTime.parse(estimatedDeliveryDate));
            session.merge(exporter);
        } catch (Exception e) {
            logger.error("Failed to update delivery schedule for exporter ID {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to update delivery schedule: " + id, e);
        }
    }

    @Override
    public void prepareShipment(Long id, Long exporterId, Long productId, Integer quantity) {
        try {
            logger.info("Preparing shipment for exporter ID: {}, productId: {}", id, productId);
            if (quantity <= 0) {
                throw new IllegalArgumentException("Quantity must be greater than 0");
            }
            Session session = sessionFactory.getCurrentSession();
            Products product = session.get(Products.class, productId.intValue());
            if (product == null) {
                throw new RuntimeException("Product not found: " + productId);
            }
            if (product.getStockQuantity() < quantity) {
                throw new RuntimeException("Insufficient stock for product ID: " + productId);
            }
            product.setStockQuantity(product.getStockQuantity() - quantity);
            session.merge(product);
        } catch (Exception e) {
            logger.error("Failed to prepare shipment for productId {}: {}", productId, e.getMessage());
            throw new RuntimeException("Failed to prepare shipment: " + productId, e);
        }
    }

    @Override
    public boolean checkStockAvailability(Long productId, Integer quantity) {
        try {
            logger.info("Checking stock availability for productId: {}, quantity: {}", productId, quantity);
            if (quantity == null || quantity <= 0) {
                return false;
            }
            Session session = sessionFactory.getCurrentSession();
            Products product = session.get(Products.class, productId.intValue());
            return product != null && product.getStockQuantity() >= quantity;
        } catch (Exception e) {
            logger.error("Failed to check stock for productId {}: {}", productId, e.getMessage());
            throw new RuntimeException("Failed to check stock: " + productId, e);
        }
    }

    @Override
    public void deleteExporter(Long id) {
        try {
            logger.info("Deleting exporter ID: {}", id);
            Session session = sessionFactory.getCurrentSession();
            Exporter exporter = session.get(Exporter.class, id);
            if (exporter == null) {
                throw new RuntimeException("Exporter not found: " + id);
            }
            exporter.setStatus(0); // Soft delete
            session.merge(exporter);
        } catch (Exception e) {
            logger.error("Failed to delete exporter ID {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to delete exporter: " + id, e);
        }
    }

    @Override
    public void createExporterDetail(ExporterDetail detail) {
        try {
            logger.info("Creating exporter detail for exporter ID: {}", detail.getExporterId());
            Session session = sessionFactory.getCurrentSession();
            session.persist(detail);
        } catch (Exception e) {
            logger.error("Failed to create exporter detail: {}", e.getMessage());
            throw new RuntimeException("Failed to create exporter detail", e);
        }
    }

    @Override
    public void deleteExporterDetailsByExporterId(Long exporterId) {
        try {
            logger.info("Deleting exporter details for exporter ID: {}", exporterId);
            Session session = sessionFactory.getCurrentSession();
            Query<?> query = session.createQuery("DELETE FROM ExporterDetail WHERE exporterId = :exporterId");
            query.setParameter("exporterId", exporterId);
            query.executeUpdate();
        } catch (Exception e) {
            logger.error("Failed to delete exporter details for exporter ID {}: {}", exporterId, e.getMessage());
            throw new RuntimeException("Failed to delete exporter details: " + exporterId, e);
        }
    }

    @Override
    public void logExporterAction(Long exporterId, String action, Long userId, String details) {
        try {
            logger.info("Logging action for exporter ID: {}, action: {}", exporterId, action);
            Session session = sessionFactory.getCurrentSession();
            ExporterHistory history = new ExporterHistory();
            history.setExporterId(exporterId);
            history.setAction(action);
            history.setUserId(userId);
            history.setActionDate(LocalDateTime.now());
            history.setDetails(details);
            history.setStatus(1);
            session.persist(history);
        } catch (Exception e) {
            logger.error("Failed to log exporter action for exporter ID {}: {}", exporterId, e.getMessage());
            throw new RuntimeException("Failed to log exporter action: " + exporterId, e);
        }
    }
}