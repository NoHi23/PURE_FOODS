package com.spring.service.Impl;

import com.spring.dao.ExporterDAO;
import com.spring.dto.ExporterDTO;
import com.spring.dto.OrderRequestDTO;
import com.spring.entity.Order;
import com.spring.entity.OrderDetails;
import com.spring.entity.Products;
import com.spring.entity.User;
import com.spring.service.ExporterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExporterServiceImpl implements ExporterService {

    @Autowired
    private ExporterDAO exporterDAO;

    @Override
    public ExporterDTO getExporterById(int id) {
        try {
            User exporter = exporterDAO.getExporterById(id);
            if (exporter == null) return null;
            return new ExporterDTO(
                    exporter.getUserId(), exporter.getFullName(), exporter.getEmail(),
                    exporter.getRoleID(), exporter.getPhone(), exporter.getAddress(),
                    exporter.getStatus(), exporter.getCreatedAt()
            );
        } catch (Exception e) {
            System.err.println("Error fetching exporter with ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public Order createOrder(OrderRequestDTO orderRequest) {
        try {
            return exporterDAO.createOrder(orderRequest);
        } catch (Exception e) {
            System.err.println("Error creating order: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<Order> getOrdersByExporterId(int exporterId, int page, int size) {
        try {
            List<Order> orders = exporterDAO.getOrdersByExporterId(exporterId, page, size);
            return orders != null ? orders : new ArrayList<>();
        } catch (Exception e) {
            System.err.println("Error fetching orders for exporter ID " + exporterId + ": " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public void manageInventory(int exporterId, int productId, int quantity, String action) {
        try {
            Products product = exporterDAO.getProductById(productId);
            if (product == null) throw new IllegalArgumentException("Product not found");

            if ("export".equalsIgnoreCase(action)) {
                exporterDAO.exportFromInventory(exporterId, 0, productId, quantity);
            } else if ("update".equalsIgnoreCase(action)) {
                product.setStockQuantity(quantity);
                exporterDAO.updateProduct(product);
            } else if ("delete".equalsIgnoreCase(action)) {
                exporterDAO.deleteProduct(productId);
            }
        } catch (Exception e) {
            System.err.println("Error managing inventory: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public void exportFromInventory(int exporterId, int orderId, int productId, int quantity) {
        try {
            exporterDAO.exportFromInventory(exporterId, orderId, productId, quantity);
        } catch (Exception e) {
            System.err.println("Error exporting from inventory: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<OrderDetails> getTransactions(int exporterId, int page, int size) {
        try {
            List<OrderDetails> transactions = exporterDAO.getTransactionsByExporterId(exporterId, page, size);
            return transactions != null ? transactions : new ArrayList<>();
        } catch (Exception e) {
            System.err.println("Error fetching transactions for exporter ID " + exporterId + ": " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public ExporterDTO updateProfile(int id, ExporterDTO exporterDTO) {
        try {
            User exporter = exporterDAO.getExporterById(id);
            if (exporter == null) return null;
            exporter.setFullName(exporterDTO.getFullName());
            exporter.setEmail(exporterDTO.getEmail());
            exporter.setPhone(exporterDTO.getPhone());
            exporter.setAddress(exporterDTO.getAddress());
            exporter.setStatus(exporterDTO.getStatus());
            exporter = exporterDAO.updateExporter(exporter);
            return new ExporterDTO(
                    exporter.getUserId(), exporter.getFullName(), exporter.getEmail(),
                    exporter.getRoleID(), exporter.getPhone(), exporter.getAddress(),
                    exporter.getStatus(), exporter.getCreatedAt()
            );
        } catch (Exception e) {
            System.err.println("Error updating profile for ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public List<Order> searchOrders(String keyword, int page, int size) {
        try {
            return exporterDAO.searchOrdersByKeyword(keyword, page, size);
        } catch (Exception e) {
            System.err.println("Error searching orders with keyword " + keyword + ": " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public ExporterDTO authenticate(String email, String password) {
        try {
            User exporter = exporterDAO.authenticate(email, password);
            if (exporter == null) return null;
            return new ExporterDTO(
                    exporter.getUserId(), exporter.getFullName(), exporter.getEmail(),
                    exporter.getRoleID(), exporter.getPhone(), exporter.getAddress(),
                    exporter.getStatus(), exporter.getCreatedAt()
            );
        } catch (Exception e) {
            System.err.println("Error authenticating exporter with email " + email + ": " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}