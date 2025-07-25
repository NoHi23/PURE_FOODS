package com.spring.dao.Impl;


import com.spring.dao.UserPromotionDAO;
import com.spring.entity.UserPromotion;
import jakarta.transaction.Transactional;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;


@Repository
@Transactional

public class UserPromotionDAOImpl implements UserPromotionDAO {
    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void save(UserPromotion userPromotion) {
        Session session = sessionFactory.getCurrentSession();
        session.save(userPromotion);
    }

    @Override
    public UserPromotion findActiveByUserIdAndCode(int userId, String code) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "FROM UserPromotion WHERE userId = :userId AND promotionCode = :code AND status = 'active'";
        return session.createQuery(hql, UserPromotion.class)
                .setParameter("userId", userId)
                .setParameter("code", code)
                .uniqueResult();
    }

    @Override
    public void update(UserPromotion userPromotion) {
        Session session = sessionFactory.getCurrentSession();
        session.update(userPromotion);
    }
    @Override
    public List<UserPromotion> getAllActivePromotions() {
        Session session = sessionFactory.getCurrentSession();
        String hql = "FROM UserPromotion WHERE status = 'active'";
        return session.createQuery(hql, UserPromotion.class).getResultList();
    }

    @Override
    public boolean existsByUserIdAndDate(int userId, LocalDate date) {
        Session session = sessionFactory.getCurrentSession();
        Long count = session.createQuery(
                        "SELECT COUNT(up) FROM UserPromotion up WHERE up.userId = :userId AND up.assignedDate = :date", Long.class)
                .setParameter("userId", userId)
                .setParameter("date", date)
                .uniqueResult();
        return count != null && count > 0;
    }

}
