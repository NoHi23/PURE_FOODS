package com.spring.dao;

import com.spring.entity.Sellers;

public interface SellersDAO {
    Sellers getSellerById(int id);
    Sellers updateSeller(Sellers seller);
}