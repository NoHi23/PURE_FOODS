package com.spring.service;

import com.spring.dto.SuppliersDTO;

import java.util.List;

public interface SuppliersService {

    SuppliersDTO getSuppliersById(int id);
    List<SuppliersDTO> getAllSuppliers();
    SuppliersDTO createSupplier(SuppliersDTO dto);
    SuppliersDTO updateSupplier(int id, SuppliersDTO dto);
    void deleteSupplier(int id);
    int countSupplier();

}
