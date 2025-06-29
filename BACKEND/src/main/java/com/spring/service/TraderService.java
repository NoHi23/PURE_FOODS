package com.spring.service;

import com.spring.dto.OrdersDTO;
import com.spring.dto.ProductDTO;
import com.spring.dto.TraderDTO;
import com.spring.dto.TraderTransactionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.math.BigDecimal;
import java.time.LocalDate;

import java.time.LocalDate;
import java.util.List;

public interface TraderService {
    /**
     * Retrieves a trader by ID.
     * @param id the trader ID
     * @return the TraderDTO
     */
    TraderDTO getTraderById(int id);

    /**
     * Retrieves transactions for a trader.
     * @param traderId the trader ID
     * @return a list of TraderTransactionDTOs
     */
    List<TraderTransactionDTO> getTraderTransactions(int traderId);

    /**
     * Records an import transaction for a trader.
     * @param traderId the trader ID
     * @param supplierId the supplier ID
     * @param productId the product ID
     * @param quantity the quantity to import
     */
    void recordTraderImport(int traderId, int supplierId, int productId, int quantity);

    /**
     * Records a sale transaction for a trader.
     * @param traderId the trader ID
     * @param productId the product ID
     * @param quantity the quantity sold
     * @param orderId the associated order ID
     */
    void recordTraderSale(int traderId, int productId, int quantity, String orderId);

    /**
     * Adds a new product by a trader.
     * @param traderId the trader ID
     * @param product the ProductDTO containing product details
     * @return the created ProductDTO
     */
    ProductDTO addProduct(int traderId, ProductDTO product);

    /**
     * Updates a product by a trader.
     * @param traderId the trader ID
     * @param product the ProductDTO containing updated details
     * @return the updated ProductDTO
     */
    ProductDTO updateProduct(int traderId, ProductDTO product);

    /**
     * Deletes a product by a trader (soft delete).
     * @param traderId the trader ID
     * @param productId the product ID
     */
    void deleteProduct(int traderId, int productId);

    /**
     * Retrieves orders related to a trader's products with pagination.
     * @param traderId the trader ID
     * @param pageable pagination information
     * @return a page of OrdersDTOs
     */
    Page<OrdersDTO> getOrdersByTrader(int traderId, Pageable pageable);

    /**
     * Calculates revenue for a trader within a date range.
     * @param traderId the trader ID
     * @param startDate the start date of the range
     * @param endDate the end date of the range
     * @return the total revenue
     */
    BigDecimal calculateRevenue(int traderId, LocalDate startDate, LocalDate endDate);
}