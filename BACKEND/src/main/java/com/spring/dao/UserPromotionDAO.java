package com.spring.dao;

import com.spring.entity.UserPromotion;

import java.util.List;

public interface UserPromotionDAO {

    void save(UserPromotion userPromotion);
    UserPromotion findActiveByUserIdAndCode(int userId, String code);
    void update(UserPromotion userPromotion);
    List<UserPromotion> getAllActivePromotions();

}
