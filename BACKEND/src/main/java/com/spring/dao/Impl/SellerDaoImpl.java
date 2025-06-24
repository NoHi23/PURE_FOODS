package com.spring.dao.Impl;

import com.spring.dao.SellersDAO;
import com.spring.entity.Sellers;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class SellerDaoImpl implements SellersDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Sellers getSellerById(int id) {
        return entityManager.find(Sellers.class, id);
    }

    @Override
    public Sellers updateSeller(Sellers seller) {
        return entityManager.merge(seller);
    }
}

