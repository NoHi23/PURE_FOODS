package com.spring.dao.Impl;

import com.spring.dao.PromotionDAO;
import com.spring.entity.Promotions;
import com.spring.entity.SpinHistory;
import jakarta.transaction.Transactional;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Transactional
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
    public Promotions getPromotionByCode(String code) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "FROM Promotions p WHERE p.promotionCode = :code";
        return session.createQuery(hql, Promotions.class)
                .setParameter("code", code)
                .uniqueResult();
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



        @Override
        public boolean existsByUserIdAndDate(int userId, LocalDate date) {
            Session session = sessionFactory.getCurrentSession();
            String hql = "SELECT COUNT(*) FROM SpinHistory WHERE userId = :userId AND spinDate = :date";
            Long count = session.createQuery(hql, Long.class)
                    .setParameter("userId", userId)
                    .setParameter("date", date)
                    .uniqueResult();
            return count != null && count > 0;
        }

        @Override
        public void saveSpinHistory(int userId, LocalDate date, String promotionCode) {
            Session session = sessionFactory.getCurrentSession();
            SpinHistory history = new SpinHistory();
            history.setUserId(userId);
            history.setSpinDate(date);
            history.setPromotionCode(promotionCode);
            session.save(history);
        }

}