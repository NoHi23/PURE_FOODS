package com.spring.service.Impl;

import com.spring.dao.ExporterDAO;
import com.spring.dto.ExporterDTO;
import com.spring.dto.TraderTransactionDTO;
import com.spring.entity.Orders;
import com.spring.entity.Products;
import com.spring.entity.Exporter;
import com.spring.service.ExporterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExporterServiceImpl implements ExporterService {

    @Autowired
    private ExporterDAO exporterDAO;

    @Override
    public ExporterDTO getExporterById(int id) {
        Exporter exporter = exporterDAO.getExporterById(id);
        if (exporter == null) return null;
        return new ExporterDTO(
                exporter.getUserID(), exporter.getFullName(), exporter.getEmail(),
                exporter.getRoleID(), exporter.getPhone(), exporter.getAddress(),
                exporter.getStatus(), exporter.getCreatedAt()
        );
    }

    @Override
    public Orders createOrder(Orders order) {
        if (order.getCustomerID() == null) {
            throw new IllegalArgumentException("Customer ID cannot be null");
        }
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(1); // Pending
        return exporterDAO.createOrder(order);
    }

    @Override
    public List<Orders> getOrdersByExporterId(int exporterId, int page, int size) {
        List<Orders> orders = exporterDAO.getOrdersByExporterId(exporterId, page, size);
        if (orders == null) return new ArrayList<>();
        return orders;
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
        if (transactions == null) return new ArrayList<>();
        return transactions;
    }

    @Override
    public ExporterDTO updateProfile(int id, ExporterDTO exporterDTO) {
        Exporter exporter = exporterDAO.getExporterById(id);
        if (exporter == null) return null;
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
    public List<Orders> searchOrders(String keyword, int page, int size) {
        return exporterDAO.searchOrdersByKeyword(keyword, page, size);
    }
}