package com.spring.dao;

import com.spring.entity.Promotions;
import java.util.List;

public interface PromotionDAO {

    Promotions getPromotionById(int id);
    List<Promotions> getAllPromotions();
    Promotions createPromotion(Promotions promotion);
    Promotions updatePromotion(Promotions promotion);
    void deletePromotion(int id);
    Promotions getPromotionByCode(String code);

}