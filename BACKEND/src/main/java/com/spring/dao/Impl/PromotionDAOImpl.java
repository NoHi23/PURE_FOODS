package com.spring.dao.Impl;

import com.spring.dao.PromotionDAO;
import com.spring.entity.Promotions;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class PromotionDAOImpl implements PromotionDAO {
    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public Promotions getPromotionById(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(Promotions.class, id);
    }

    @Override
    public List<Promotions> getAllPromotions() {
        Session session = sessionFactory.getCurrentSession();
        Query<Promotions> query = session.createQuery("FROM Promotions", Promotions.class);
        return query.getResultList();
    }

    @Override
    public Promotions createPromotion(Promotions promotion) {
        Session session = sessionFactory.getCurrentSession();
        session.save(promotion);
        return promotion;
    }

    @Override
    public Promotions updatePromotion(Promotions promotion) {
        Session session = sessionFactory.getCurrentSession();
        session.update(promotion);
        return promotion;
    }

    @Override
    public void deletePromotion(int id) {
        Session session = sessionFactory.getCurrentSession();
        Promotions promotion = session.get(Promotions.class, id);
        if (promotion != null) {
            session.delete(promotion);
        }
    }
}