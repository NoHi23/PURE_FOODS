package com.spring.dao;

import com.spring.entity.Suppliers;

import java.util.List;

public interface SuppliersDAO {
    Suppliers getSuppliersById(int id);
    List<Suppliers> getAllSuppliers();
    void createSupplier(Suppliers supplier);
    void updateSupplier(Suppliers supplier);
    void deleteSupplier(int id);
    int countSuppliers();
}
