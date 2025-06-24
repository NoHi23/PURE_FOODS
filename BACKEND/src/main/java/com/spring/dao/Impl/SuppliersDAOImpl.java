package com.spring.dao.Impl;

import com.spring.dao.SuppliersDAO;
import com.spring.entity.Category;
import com.spring.entity.Suppliers;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SuppliersDAOImpl implements SuppliersDAO {
    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public Suppliers getSuppliersById(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(Suppliers.class, id);
    }

    @Override
    public List<Suppliers> getAllSupplier() {
        Session session = sessionFactory.getCurrentSession();
        Query<Suppliers> query = session.createQuery("FROM Suppliers", Suppliers.class);
        return query.getResultList();
    }
}
