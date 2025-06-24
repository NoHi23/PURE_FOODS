package com.spring.service.Impl;

import com.spring.dao.CategoryDAO;
import com.spring.dao.SuppliersDAO;
import com.spring.dto.CategoryDTO;
import com.spring.dto.SuppliersDTO;
import com.spring.entity.Category;
import com.spring.entity.Suppliers;
import com.spring.service.SuppliersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(propagation = Propagation.REQUIRED)
public class SuppliersServiceImpl implements SuppliersService {
    @Autowired
    private SuppliersDAO suppliersDAO;

    @Override
    public SuppliersDTO getSuppliersById(int id) {
        Suppliers suppliers = suppliersDAO.getSuppliersById(id);
        if(suppliers == null){
            throw new RuntimeException("Suppliers not found");
        }
        return convertToDTO(suppliers);
    }
    private SuppliersDTO convertToDTO(Suppliers suppliers) {
        return new SuppliersDTO(
                suppliers.getSupplierID(),
                suppliers.getSupplierName(),
                suppliers.getContactName(),
                suppliers.getPhone(),
                suppliers.getEmail(),
                suppliers.getAddress(),
                suppliers.getOrganicCertification(),
                suppliers.getCertificationExpiry(),
                suppliers.getCreatedAt(),
                suppliers.getStatus()
        );
    }

    @Override
    public List<SuppliersDTO> getAllSuppliers() {
        List<Suppliers> suppliersList = suppliersDAO.getAllSuppliers();
        if (suppliersList == null || suppliersList.isEmpty()) {
            throw new RuntimeException("No suppliers found");
        }
        List<SuppliersDTO> dtoList = new ArrayList<>();
        for (Suppliers supplier : suppliersList) {
            dtoList.add(convertToDTO(supplier));
        }
        return dtoList;
    }

}
