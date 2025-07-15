package com.spring.dao.Impl;

import com.spring.dao.CouponDAO;
import com.spring.entity.Coupon;
import jakarta.persistence.NoResultException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class CouponDAOImpl implements CouponDAO {
    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public Coupon addCoupon(Coupon coupon) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(coupon);
        session.flush();
        return coupon;
    }

    @Override
    public Coupon findCouponByCode(String couponCode) {
        Session session = sessionFactory.getCurrentSession();
        Query<Coupon> query = session.createQuery("from Coupon where couponCode = :couponCode", Coupon.class);
        query.setParameter("couponCode", couponCode);
        return query.uniqueResult();
    }

    @Override
    public List<Coupon> getAllCoupons() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("from Coupon", Coupon.class).list();
    }

    @Override
    public Coupon getCouponById(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(Coupon.class, id);
    }

    @Override
    public Coupon updateCoupon(Coupon coupon) {
        Session session = sessionFactory.getCurrentSession();
        session.update(coupon);
        return coupon;
    }

    @Override
    public void deleteCoupon(int id) {
        Session session = sessionFactory.getCurrentSession();
        Coupon coupon = session.get(Coupon.class, id);
        session.delete(coupon);
    }

    @Override
    public int countCoupons() {
        Session session = sessionFactory.getCurrentSession();
        Query query = session.createQuery("select count(*) from Coupon");
        return ((Long) query.uniqueResult()).intValue();
    }
}