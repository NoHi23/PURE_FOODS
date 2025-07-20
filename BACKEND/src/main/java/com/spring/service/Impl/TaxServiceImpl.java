package com.spring.service.Impl;

import com.spring.dao.TaxDAO;
import com.spring.dto.TaxDTO;
import com.spring.entity.Tax;
import com.spring.service.TaxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(propagation = Propagation.REQUIRED)
public class TaxServiceImpl implements TaxService {

    @Autowired
    private TaxDAO taxDAO;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    public TaxDTO getTaxById(int id) {
        Tax tax = taxDAO.getTaxById(id);
        if (tax == null) {
            throw new RuntimeException("Tax not found");
        }
        return convertToDTO(tax);
    }

    @Override
    public List<TaxDTO> getAllTaxes() {
        List<Tax> taxes = taxDAO.getAllTaxes();
        return taxes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TaxDTO createTax(TaxDTO dto) {
        Tax tax = convertToEntity(dto);
        Tax created = taxDAO.createTax(tax);
        return convertToDTO(created);
    }

    @Override
    public TaxDTO updateTax(int id, TaxDTO dto) {
        Tax existing = taxDAO.getTaxById(id);
        if (existing == null) {
            throw new RuntimeException("Tax not found");
        }

        existing.setTaxName(dto.getTaxName());
        existing.setTaxRate(dto.getTaxRate());
        existing.setDescription(dto.getDescription());
        existing.setEffectiveDate(LocalDate.parse(dto.getEffectiveDate(), formatter));
        existing.setStatus(dto.getStatus());

        Tax updated = taxDAO.updateTax(existing);
        return convertToDTO(updated);
    }

    @Override
    public void deleteTax(int id) {
        taxDAO.deleteTax(id);
    }

    private TaxDTO convertToDTO(Tax tax) {
        return new TaxDTO(
                tax.getTaxID(),
                tax.getTaxName(),
                tax.getTaxRate(),
                tax.getDescription(),
                tax.getEffectiveDate().format(formatter),
                tax.getStatus()
        );
    }

    private Tax convertToEntity(TaxDTO dto) {
        Tax tax = new Tax();
        tax.setTaxID(dto.getTaxID());
        tax.setTaxName(dto.getTaxName());
        tax.setTaxRate(dto.getTaxRate());
        tax.setDescription(dto.getDescription());
        tax.setEffectiveDate(LocalDate.parse(dto.getEffectiveDate(), formatter));
        tax.setStatus(dto.getStatus());
        return tax;
    }
}