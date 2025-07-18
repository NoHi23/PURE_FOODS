package com.spring.dao.Impl;

import com.spring.dao.TraderProductsDAO;
import com.spring.entity.TraderProducts;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class TraderProductsDAOImpl implements TraderProductsDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public TraderProducts getTraderProductById(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(TraderProducts.class, id);
    }

    @Override
    public List<TraderProducts> getAllTraderProducts() {
        Session session = sessionFactory.getCurrentSession();
        Query<TraderProducts> query = session.createQuery("FROM TraderProducts WHERE status = 1", TraderProducts.class);
        return query.getResultList();
    }

    @Override
    public TraderProducts createTraderProduct(TraderProducts traderProduct) {
        Session session = sessionFactory.getCurrentSession();
        session.save(traderProduct);
        return traderProduct;
    }

    @Override
    public TraderProducts updateTraderProduct(TraderProducts traderProduct) {
        Session session = sessionFactory.getCurrentSession();
        session.update(traderProduct);
        return traderProduct;
    }

    @Override
    public void deleteTraderProduct(int id) {
        Session session = sessionFactory.getCurrentSession();
        TraderProducts traderProduct = session.get(TraderProducts.class, id);
        if (traderProduct != null) {
            session.delete(traderProduct);
        }
    }

    @Override
    public TraderProducts getLatestTraderProduct() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("FROM TraderProducts ORDER BY traderProductId DESC", TraderProducts.class)
                .setMaxResults(1)
                .uniqueResult();
    }
}