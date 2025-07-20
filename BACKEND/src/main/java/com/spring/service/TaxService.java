package com.spring.service;

import com.spring.dto.TaxDTO;
import java.util.List;

public interface TaxService {

    TaxDTO getTaxById(int id);

    List<TaxDTO> getAllTaxes();

    TaxDTO createTax(TaxDTO taxDTO);

    TaxDTO updateTax(int id, TaxDTO taxDTO);

    void deleteTax(int id);
}