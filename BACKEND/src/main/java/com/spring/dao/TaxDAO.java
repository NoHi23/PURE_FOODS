package com.spring.dao;

import com.spring.entity.Tax;
import java.util.List;

public interface TaxDAO {

    Tax getTaxById(int id);
    List<Tax> getAllTaxes();
    Tax createTax(Tax tax);
    Tax updateTax(Tax tax);
    void deleteTax(int id);
}