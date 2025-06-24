package com.spring.service;

import com.spring.dto.SuppliersDTO;

import java.util.List;

public interface SuppliersService {

    SuppliersDTO getSuppliersById(int id);

    List<SuppliersDTO> getAllSupplier();

}
