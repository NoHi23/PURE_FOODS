package com.spring.service;

import com.spring.dto.SuppliersDTO;
import com.spring.entity.Suppliers;

import java.util.List;

public interface SuppliersService {

    SuppliersDTO getSuppliersById(int id);
    List<SuppliersDTO> getAllSuppliers();
    SuppliersDTO createSupplier(SuppliersDTO dto);
    SuppliersDTO updateSupplier(int id, SuppliersDTO dto);
    void deleteSupplier(int id);
    int countSupplier();
    String findNameById(Integer id);
    Suppliers findByName(String name);
}
