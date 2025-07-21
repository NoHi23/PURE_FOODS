package com.spring.dao.Impl;

import com.spring.dao.TaxDAO;
import com.spring.entity.Tax;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class TaxDAOImpl implements TaxDAO {
    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public Tax getTaxById(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(Tax.class, id);
    }

    @Override
    public List<Tax> getAllTaxes() {
        Session session = sessionFactory.getCurrentSession();
        Query<Tax> query = session.createQuery("FROM Tax", Tax.class);
        return query.getResultList();
    }

    @Override
    public Tax createTax(Tax tax) {
        Session session = sessionFactory.getCurrentSession();
        session.save(tax);
        return tax;
    }

    @Override
    public Tax updateTax(Tax tax) {
        Session session = sessionFactory.getCurrentSession();
        session.update(tax);
        return tax;
    }

    @Override
    public void deleteTax(int id) {
        Session session = sessionFactory.getCurrentSession();
        Tax tax = session.get(Tax.class, id);
        if (tax != null) {
            session.delete(tax);
        }
    }
}