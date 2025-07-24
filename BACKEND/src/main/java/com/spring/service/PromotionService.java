package com.spring.service;

import com.spring.dto.PromotionDTO;
import java.util.List;
import java.util.Map;

public interface PromotionService {

    PromotionDTO getPromotionById(int id);

    List<PromotionDTO> getAllPromotions();

    PromotionDTO createPromotion(PromotionDTO promotionDTO);

    PromotionDTO updatePromotion(int id, PromotionDTO promotionDTO);

    void deletePromotion(int id);

    PromotionDTO getPromotionByCode(String code);
    Map<String, Object> spinWheel(int userId);
    void expireOldUserPromotions();
    List<PromotionDTO> getPromotionsByUserId(int userId);

}