package com.spring.dao.Impl;

import com.spring.dao.TraderProductMappingDAO;
import com.spring.entity.TraderProductMapping;
import jakarta.transaction.Transactional;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
@Transactional
public class TraderProductMappingDAOImpl implements TraderProductMappingDAO {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(TraderProductMapping mapping) {
        getSession().persist(mapping);
    }

    @Override
    public TraderProductMapping findByProductId(int productId) {
        String hql = "FROM TraderProductMapping WHERE productId = :productId";
        return getSession().createQuery(hql, TraderProductMapping.class)
                .setParameter("productId", productId)
                .uniqueResult();
    }
    @Override
    public TraderProductMapping getByProductIdAndTraderId(int productId, int traderId) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "FROM TraderProductMapping WHERE productId = :productId AND userId = :traderId";
        return session.createQuery(hql, TraderProductMapping.class)
                .setParameter("productId", productId)
                .setParameter("traderId", traderId)
                .uniqueResult();
    }

    @Override
    public TraderProductMapping findByTraderProductId(int traderProductId) {
        String hql = "FROM TraderProductMapping WHERE traderProductId = :traderProductId";
        return getSession().createQuery(hql, TraderProductMapping.class)
                .setParameter("traderProductId", traderProductId)
                .uniqueResult();
    }

    @Override
    public void deleteById(int mappingId) {
        TraderProductMapping mapping = getSession().get(TraderProductMapping.class, mappingId);
        if (mapping != null) {
            getSession().remove(mapping);
        }
    }
    public List<TraderProductMapping> findAll() {
        String hql = "FROM TraderProductMapping";
        return getSession().createQuery(hql, TraderProductMapping.class).getResultList();
    }
}
