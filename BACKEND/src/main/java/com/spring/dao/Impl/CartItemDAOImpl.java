package com.spring.dao.Impl;

import com.spring.dao.CartItemDAO;
import com.spring.entity.CartItem;
import jakarta.transaction.Transactional;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class CartItemDAOImpl implements CartItemDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public CartItem getCartItemById(Long id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(CartItem.class, id);
    }

    @Override
    public List<CartItem> getCartItemsByUserId(Long userID) {
        Session session = sessionFactory.getCurrentSession();
        Query<CartItem> query = session.createQuery("FROM CartItem WHERE userID = :userID", CartItem.class);
        query.setParameter("userID", userID);
        return query.getResultList();
    }

    @Override
    public CartItem createCartItem(CartItem cartItem) {
        Session session = sessionFactory.getCurrentSession();
        session.save(cartItem);
        return cartItem;
    }

    @Override
    public CartItem updateCartItem(CartItem cartItem) {
        Session session = sessionFactory.getCurrentSession();
        session.update(cartItem);
        return cartItem;
    }

    @Override
    public void deleteCartItem(Long id) {
        Session session = sessionFactory.getCurrentSession();
        CartItem item = session.get(CartItem.class, id);
        if (item != null) {
            session.delete(item);
        }
    }

    @Override
    public CartItem findByUserAndProduct(Long userId, Long productId) {
        Session session = sessionFactory.getCurrentSession();
        Query<CartItem> query = session.createQuery(
                "FROM CartItem WHERE userID = :userId AND productID = :productId AND status = 0", CartItem.class);
        query.setParameter("userId", userId);
        query.setParameter("productId", productId);

        List<CartItem> results = query.getResultList();
        return results.isEmpty() ? null : results.get(0);
    }

    @Override
    @Transactional
    public void deleteByUserId(int userId) {
        Session session = sessionFactory.getCurrentSession();
        Query<?> query = session.createQuery("DELETE FROM CartItem WHERE userID = :userId");
        query.setParameter("userId", userId);
        query.executeUpdate();
    }

}
