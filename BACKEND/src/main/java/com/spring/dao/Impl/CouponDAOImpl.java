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


    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }


    @Override
    public Coupon addCoupon(Coupon coupon) {
        getCurrentSession().persist(coupon);
        getCurrentSession().flush();
        return coupon;
    }


    @Override
    public List<Coupon> getAllCoupons() {
        return getCurrentSession()
                .createQuery("FROM Coupon", Coupon.class)
                .getResultList();
    }


    @Override
    public Coupon getCouponById(Long id) {
        return getCurrentSession().get(Coupon.class, id);
    }


    @Override
    public Coupon updateCoupon(Coupon coupon) {
        getCurrentSession().update(coupon);
        return coupon;
    }


    @Override
    public Coupon deleteCoupon(Long id) {
        Coupon coupon = getCurrentSession().get(Coupon.class, id);
        if (coupon != null) {
            coupon.setStatus(0); // Xoá mềm
            getCurrentSession().update(coupon);
        }
        return coupon;
    }


    @Override
    public Coupon findByCode(String code) {
        try {
            Query<Coupon> query = getCurrentSession()
                    .createQuery("FROM Coupon WHERE code = :code", Coupon.class);
            query.setParameter("code", code);
            return query.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }
}
