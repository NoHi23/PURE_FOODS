package com.spring.dao.Impl;

import com.spring.dao.TraderDAO;
import com.spring.entity.Orders;
import com.spring.entity.Products;
import com.spring.entity.Trader;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;

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

    public Orders createOrder(Orders order) {
        entityManager.persist(order);
        return order;
    }

    public List<Orders> getOrdersByTraderId(int traderId) {
        Query query = entityManager.createQuery("SELECT o FROM Orders o WHERE o.customerId = :traderId");
        query.setParameter("traderId", traderId);
        return query.getResultList();
    }

    public Products getProductById(int productId) {
        return entityManager.find(Products.class, productId);
    }

    public void updateProductStock(int productId, int stockQuantity) {
        Products product = entityManager.find(Products.class, productId);
        if (product != null) {
            product.setStockQuantity(stockQuantity);
            entityManager.merge(product);
        }
    }

    public void deleteProduct(int productId) {
        Products product = entityManager.find(Products.class, productId);
        if (product != null) {
            entityManager.remove(product);
        }
    }

    public void importFromSupplier(int traderId, int productId, int quantity) {
        Products product = entityManager.find(Products.class, productId);
        if (product != null) {
            int newStock = product.getStockQuantity() + quantity;
            product.setStockQuantity(newStock);
            product.setLastUpdateBy(traderId); // Sử dụng trường hiện có, mặc dù tên có lỗi
            entityManager.merge(product);
        }
    }
}