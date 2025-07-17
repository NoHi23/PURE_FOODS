package com.spring.service.Impl;

import com.spring.dao.ExporterDAO;
import com.spring.dto.ExporterDTO;
import com.spring.dto.TraderTransactionDTO;
import com.spring.entity.Exporter;
import com.spring.entity.Order;
import com.spring.entity.Products;
import com.spring.service.ExporterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ExporterServiceImpl implements ExporterService {

    @Autowired
    private ExporterDAO exporterDAO;

    @Override
    public ExporterDTO getExporterById(int id) {
        Exporter exporter = exporterDAO.getExporterById(id);
        if (exporter == null) return new ExporterDTO(0, "", "", null, "", "", null, null);
        return new ExporterDTO(
                exporter.getUserID(), exporter.getFullName(), exporter.getEmail(),
                exporter.getRoleID(), exporter.getPhone(), exporter.getAddress(),
                exporter.getStatus(), exporter.getCreatedAt()
        );
    }

    @Override
    public Order createOrder(Order order) {
        if (order.getCustomerID() == null) {
            throw new IllegalArgumentException("Customer ID cannot be null");
        }
        order.setOrderDate(Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant()));
        order.setStatusID(1); // Pending
        order.setTotalAmount(0.0); // Default totalAmount
        return exporterDAO.createOrder(order);
    }

    @Override
    public List<Order> getOrdersByExporterId(int exporterId, int page, int size) {
        List<Order> orders = exporterDAO.getOrdersByExporterId(exporterId, page, size);
        return orders != null ? orders : new ArrayList<>();
    }

    @Override
    public void manageInventory(int exporterId, int productId, int quantity, String action) {
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
    }

    @Override
    public void exportFromInventory(int exporterId, int orderId, int productId, int quantity) {
        exporterDAO.exportFromInventory(exporterId, orderId, productId, quantity);
    }

    @Override
    public List<TraderTransactionDTO> getTransactions(int exporterId, int page, int size) {
        List<TraderTransactionDTO> transactions = exporterDAO.getTransactionsByExporterId(exporterId, page, size);
        return transactions != null ? transactions : new ArrayList<>();
    }

    @Override
    public ExporterDTO updateProfile(int id, ExporterDTO exporterDTO) {
        Exporter exporter = exporterDAO.getExporterById(id);
        if (exporter == null) return new ExporterDTO(0, "", "", null, "", "", null, null);
        exporter.setFullName(exporterDTO.getFullName());
        exporter.setEmail(exporterDTO.getEmail());
        exporter.setPhone(exporterDTO.getPhone());
        exporter.setAddress(exporterDTO.getAddress());
        exporter.setStatus(exporterDTO.getStatus());
        exporter = exporterDAO.updateExporter(exporter);
        return new ExporterDTO(
                exporter.getUserID(), exporter.getFullName(), exporter.getEmail(),
                exporter.getRoleID(), exporter.getPhone(), exporter.getAddress(),
                exporter.getStatus(), exporter.getCreatedAt()
        );
    }

    @Override
    public List<Order> searchOrders(String keyword, int page, int size) {
        return exporterDAO.searchOrdersByKeyword(keyword, page, size);
    }

    @Override
    public void deleteOrder(int orderId) {
        exporterDAO.deleteOrder(orderId);
    }
}