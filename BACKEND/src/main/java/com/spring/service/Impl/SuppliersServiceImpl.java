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
import java.util.List;
import java.util.stream.Collectors;

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


    @Override
    public List<SuppliersDTO> getAllSuppliers() {
        List<Suppliers> list = suppliersDAO.getAllSuppliers();
        return list.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SuppliersDTO createSupplier(SuppliersDTO dto) {
        Suppliers supplier = convertToEntity(dto);
        suppliersDAO.createSupplier(supplier);
        return convertToDTO(supplier);
    }

    @Override
    public SuppliersDTO updateSupplier(int id, SuppliersDTO dto) {
        Suppliers existing = suppliersDAO.getSuppliersById(id);
        if (existing == null) {
            throw new RuntimeException("Supplier not found");
        }

        // Cập nhật dữ liệu
        existing.setSupplierName(dto.getSupplierName());
        existing.setContactName(dto.getContactName());
        existing.setPhone(dto.getPhone());
        existing.setEmail(dto.getEmail());
        existing.setAddress(dto.getAddress());
        existing.setOrganicCertification(dto.getOrganicCertification());
        existing.setCertificationExpiry(dto.getCertificationExpiry());
        existing.setStatus(dto.getStatus());

        suppliersDAO.updateSupplier(existing);
        return convertToDTO(existing);
    }

    @Override
    public void deleteSupplier(int id) {
        Suppliers supplier = suppliersDAO.getSuppliersById(id);
        if (supplier == null) {
            throw new RuntimeException("Supplier not found");
        }
        suppliersDAO.deleteSupplier(id);
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

    private Suppliers convertToEntity(SuppliersDTO dto) {
        Suppliers s = new Suppliers();
        s.setSupplierID(dto.getSupplierID());
        s.setSupplierName(dto.getSupplierName());
        s.setContactName(dto.getContactName());
        s.setPhone(dto.getPhone());
        s.setEmail(dto.getEmail());
        s.setAddress(dto.getAddress());
        s.setOrganicCertification(dto.getOrganicCertification());
        s.setCertificationExpiry(dto.getCertificationExpiry());
        s.setCreatedAt(dto.getCreatedAt());
        s.setStatus(dto.getStatus());
        return s;
    }


}
