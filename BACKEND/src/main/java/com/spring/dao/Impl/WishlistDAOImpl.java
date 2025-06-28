package com.spring.dao.Impl;

import com.spring.dao.WishlistDAO;
import com.spring.entity.User;
import com.spring.entity.Wishlist;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class WishlistDAOImpl implements WishlistDAO {
    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public Wishlist addWishlist(Wishlist wishlist) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(wishlist);
        session.flush();
        return wishlist;
    }

    @Override
    public void deleteWishList(int id) {
        Session session = sessionFactory.getCurrentSession();
        Wishlist wishlist = session.get(Wishlist.class, id);
        session.delete(wishlist);
    }

    @Override
    public List<Wishlist> getWishlistByUserID(int userID) {
        Session session = sessionFactory.getCurrentSession();
        return session
                .createQuery("from Wishlist w where w.userId = :userID", Wishlist.class)
                .setParameter("userID", userID)
                .getResultList();
    }

    @Override
    public int countWishlist(int userID) {
        Session session = sessionFactory.getCurrentSession();
        Long count = session.createQuery(
                        "SELECT COUNT(w.id) FROM Wishlist w WHERE w.userId = :userID", Long.class)
                .setParameter("userID", userID)
                .uniqueResult();
        return count.intValue();
    }

    @Override
    public Wishlist getWishlistById(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(Wishlist.class, id);
    }
}
