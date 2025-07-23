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
    public List<Suppliers> getAllSuppliers() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("FROM Suppliers", Suppliers.class).getResultList();
    }

    @Override
    public void createSupplier(Suppliers supplier) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(supplier);
    }

    @Override
    public void updateSupplier(Suppliers supplier) {
        Session session = sessionFactory.getCurrentSession();
        session.merge(supplier);
    }

    @Override
    public void deleteSupplier(int id) {
        Session session = sessionFactory.getCurrentSession();
        Suppliers s = session.get(Suppliers.class, id);
        if (s != null) {
            session.remove(s);
        }
    }

    @Override
    public int countSuppliers() {
        Session session = sessionFactory.getCurrentSession();
        Query<Long> query = session.createQuery("SELECT COUNT(*) FROM Suppliers", Long.class);
        return query.uniqueResult().intValue();
    }

    @Override
    public Suppliers getSupplierByName(String name) {
        Session session = sessionFactory.getCurrentSession();
        Query<Suppliers> query = session.createQuery(
                "FROM Suppliers WHERE LOWER(supplierName) LIKE :name", Suppliers.class);
        query.setParameter("name", "%" + name.toLowerCase().trim() + "%");
        List<Suppliers> result = query.getResultList();
        return result.isEmpty() ? null : result.get(0); // lấy kết quả đầu tiên khớp gần đúng
    }

}
