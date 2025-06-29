package com.spring.service.Impl;

import com.spring.dao.TraderDAO;
import com.spring.dto.OrdersDTO;
import com.spring.dto.ProductDTO;
import com.spring.dto.TraderDTO;
import com.spring.dto.TraderTransactionDTO;
import com.spring.entity.Orders;
import com.spring.entity.Products;
import com.spring.entity.Trader;
import com.spring.service.TraderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
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
        order.setOrderDate(new Date());
        order.setStatus(1); // Pending
        return traderDAO.createOrder(order);
    }

    @Override
    public List<Orders> trackOrders(int traderId) {
        return traderDAO.getOrdersByTraderId(traderId);
    }

    @Override
    public void manageInventory(int traderId, int productId, int quantity, String action) {
        Products product = traderDAO.getProductById(productId);
        if (product == null) throw new RuntimeException("Product not found");

        if ("import".equalsIgnoreCase(action)) {
            traderDAO.importFromSupplier(traderId, productId, quantity);
        } else if ("update".equalsIgnoreCase(action)) {
            product.setStockQuantity(quantity);
            traderDAO.updateProductStock(productId, quantity);
        } else if ("delete".equalsIgnoreCase(action)) {
            traderDAO.deleteProduct(productId);
        }
    }
}