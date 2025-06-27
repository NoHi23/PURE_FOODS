package com.spring.dao.Impl;

import com.spring.dao.TraderDAO;
import com.spring.dto.TraderDTO;
import com.spring.dto.TraderTransactionDTO;
import com.spring.entity.User;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TraderDAOImpl implements TraderDAO {
    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public TraderDTO getTraderById(int id) {
        Session session = sessionFactory.getCurrentSession();
        Query<User> query = session.createQuery("FROM User WHERE userId = :id AND roleID = 3 AND status = 1", User.class);
        query.setParameter("id", id);
        User user = query.uniqueResult();
        if (user == null) {
            return null;
        }
        return new TraderDTO(
                user.getUserId(),          // Thay getUserID() bằng getUserId()
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress(),
                user.getCreatedAt(),
                user.getStatus()
        );
    }

    @Override
    public List<TraderTransactionDTO> getTraderTransactions(int traderId) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "SELECT new com.spring.dto.TraderTransactionDTO(" +
                "il.userID, il.productID, ABS(il.quantityChange), " +
                "CASE WHEN il.quantityChange > 0 THEN 'IN' ELSE 'OUT' END, " +
                "s.supplierName, p.productName, CAST(o.orderID AS string)) " +
                "FROM InventoryLogs il " +
                "JOIN Products p ON il.productID = p.productID " +
                "JOIN Suppliers s ON p.supplierID = s.supplierID " +
                "LEFT JOIN Orders o ON il.reason LIKE '%đơn hàng #' + CAST(o.orderID AS string) " +
                "WHERE il.userID = :traderId AND il.status = 1";
        Query<TraderTransactionDTO> query = session.createQuery(hql, TraderTransactionDTO.class);
        query.setParameter("traderId", traderId);
        return query.list();
    }

    @Override
    public void recordTraderImport(int traderId, int supplierId, int productId, int quantity) {
        Session session = sessionFactory.getCurrentSession();
        session.createNativeQuery(
                        "INSERT INTO InventoryLogs (ProductID, UserID, QuantityChange, Reason, CreatedAt, Status) " +
                                "VALUES (?, ?, ?, 'Stock replenishment from Supplier #' + CAST(? AS NVARCHAR), GETDATE(), 1)")
                .setParameter(1, productId)
                .setParameter(2, traderId)
                .setParameter(3, quantity)
                .setParameter(4, supplierId)
                .executeUpdate();

        session.createNativeQuery(
                        "UPDATE Products SET StockQuantity = StockQuantity + ? WHERE ProductID = ? AND SupplierID = ?")
                .setParameter(1, quantity)
                .setParameter(2, productId)
                .setParameter(3, supplierId)
                .executeUpdate();
    }

    @Override
    public void recordTraderSale(int traderId, int productId, int quantity, String orderId) {
        Session session = sessionFactory.getCurrentSession();
        session.createNativeQuery(
                        "INSERT INTO InventoryLogs (ProductID, UserID, QuantityChange, Reason, CreatedAt, Status) " +
                                "VALUES (?, ?, ?, 'Xuất kho theo đơn hàng #' + ?, GETDATE(), 1)")
                .setParameter(1, productId)
                .setParameter(2, traderId)
                .setParameter(3, -quantity)
                .setParameter(4, orderId)
                .executeUpdate();

        session.createNativeQuery(
                        "UPDATE Products SET StockQuantity = StockQuantity - ? WHERE ProductID = ?")
                .setParameter(1, quantity)
                .setParameter(2, productId)
                .executeUpdate();
    }
}