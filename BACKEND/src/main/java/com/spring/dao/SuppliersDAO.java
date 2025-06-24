package com.spring.dao;

import com.spring.entity.Suppliers;

import java.util.List;

public interface SuppliersDAO {
    Suppliers getSuppliersById(int id);
    List<Suppliers> getAllSupplier();
}
