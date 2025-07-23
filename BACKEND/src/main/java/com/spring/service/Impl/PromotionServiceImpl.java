package com.spring.service.Impl;

import com.spring.dao.PromotionDAO;
import com.spring.dto.PromotionDTO;
import com.spring.entity.Promotions;
import com.spring.service.PromotionService;
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
public class PromotionServiceImpl implements PromotionService {

    @Autowired
    private PromotionDAO promotionDAO;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    public PromotionDTO getPromotionById(int id) {
        Promotions promotion = promotionDAO.getPromotionById(id);
        if (promotion == null) {
            throw new RuntimeException("Promotion not found");
        }
        return convertToDTO(promotion);
    }

    @Override
    public PromotionDTO getPromotionByCode(String code) {
        Promotions promotion = promotionDAO.getPromotionByCode(code);
        if (promotion == null) {
            throw new RuntimeException("Promotion not found");
        }
        return convertToDTO(promotion);
    }

    @Override
    public List<PromotionDTO> getAllPromotions() {
        List<Promotions> promotions = promotionDAO.getAllPromotions();
        return promotions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PromotionDTO createPromotion(PromotionDTO dto) {
        Promotions promotion = convertToEntity(dto);
        Promotions created = promotionDAO.createPromotion(promotion);
        return convertToDTO(created);
    }

    @Override
    public PromotionDTO updatePromotion(int id, PromotionDTO dto) {
        Promotions existing = promotionDAO.getPromotionById(id);
        if (existing == null) {
            throw new RuntimeException("Promotion not found");
        }

        existing.setPromotionCode(dto.getPromotionCode());
        existing.setDescription(dto.getDescription());
        existing.setDiscountType(dto.getDiscountType());
        existing.setDiscountValue(dto.getDiscountValue());
        existing.setStartDate(LocalDate.parse(dto.getStartDate(), formatter));
        existing.setEndDate(LocalDate.parse(dto.getEndDate(), formatter));
        existing.setMinOrderAmount(dto.getMinOrderAmount());
        existing.setStatus(dto.getStatus());

        Promotions updated = promotionDAO.updatePromotion(existing);
        return convertToDTO(updated);
    }

    @Override
    public void deletePromotion(int id) {
        promotionDAO.deletePromotion(id);
    }

    private PromotionDTO convertToDTO(Promotions promotion) {
        return new PromotionDTO(
                promotion.getPromotionID(),
                promotion.getPromotionCode(),
                promotion.getDescription(),
                promotion.getDiscountType(),
                promotion.getDiscountValue(),
                promotion.getStartDate().format(formatter),
                promotion.getEndDate().format(formatter),
                promotion.getMinOrderAmount(),
                promotion.getStatus()
        );
    }

    private Promotions convertToEntity(PromotionDTO dto) {
        Promotions promotion = new Promotions();
        promotion.setPromotionID(dto.getPromotionID());
        promotion.setPromotionCode(dto.getPromotionCode());
        promotion.setDescription(dto.getDescription());
        promotion.setDiscountType(dto.getDiscountType());
        promotion.setDiscountValue(dto.getDiscountValue());
        promotion.setStartDate(LocalDate.parse(dto.getStartDate(), formatter));
        promotion.setEndDate(LocalDate.parse(dto.getEndDate(), formatter));
        promotion.setMinOrderAmount(dto.getMinOrderAmount());
        promotion.setStatus(dto.getStatus());
        return promotion;
    }
}