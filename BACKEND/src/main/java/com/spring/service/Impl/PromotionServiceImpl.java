package com.spring.service.Impl;

import com.spring.dao.PromotionDAO;
import com.spring.dao.UserPromotionDAO;
import com.spring.dto.PromotionDTO;
import com.spring.entity.Promotions;
import com.spring.entity.SpinHistory;
import com.spring.entity.UserPromotion;
import com.spring.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(propagation = Propagation.REQUIRED)
public class PromotionServiceImpl implements PromotionService {

    @Autowired
    private PromotionDAO promotionDAO;

    @Autowired
    private UserPromotionDAO userPromotionDAO;


    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    @Autowired
    private PromotionService promotionService;

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
        existing.setEndDate(dto.getEndDate());
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
                promotion.getEndDate(),
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
        promotion.setEndDate(dto.getEndDate());
        promotion.setMinOrderAmount(dto.getMinOrderAmount());
        promotion.setStatus(dto.getStatus());
        return promotion;
    }

    @Override
    public Map<String, Object> spinWheel(int userId) {
        LocalDate today = LocalDate.now();

        // Kiểm tra user đã quay hôm nay chưa
        boolean alreadySpun = promotionDAO.existsByUserIdAndDate(userId, today);
        if (alreadySpun) {
            throw new IllegalStateException("Bạn đã quay vòng hôm nay rồi!");
        }


        // Lấy danh sách các mã giảm giá đang hoạt động
        List<PromotionDTO> allPromotions = getAllPromotions();

        // Sắp xếp tăng dần theo discountValue
        List<PromotionDTO> sortedPromotions = allPromotions.stream()
                .sorted(Comparator.comparingDouble(PromotionDTO::getDiscountValue))
                .collect(Collectors.toList());

        List<PromotionDTO> selectedPromotions = new ArrayList<>();

        int size = sortedPromotions.size();
        if (size >= 5) {
            // ✅ 2 mã giảm ít nhất
            selectedPromotions.add(sortedPromotions.get(0));
            selectedPromotions.add(sortedPromotions.get(1));

            // ✅ 2 mã giảm vừa vừa (ở giữa danh sách)
            int midStart = size / 2 - 1;
            selectedPromotions.add(sortedPromotions.get(midStart));
            selectedPromotions.add(sortedPromotions.get(midStart + 1));

            // ✅ 1 mã giảm nhiều nhất
            selectedPromotions.add(sortedPromotions.get(size - 1));
        } else {
            // Nếu không đủ 5 mã, dùng hết danh sách hiện có
            selectedPromotions.addAll(sortedPromotions);
        }
        // ✅ Bước 1: Tính tổng 1/discount
        double totalInverse = selectedPromotions.stream()
                .filter(p -> p.getDiscountValue() > 0)
                .mapToDouble(p -> 1.0 / p.getDiscountValue())
                .sum();

        // ✅ Bước 2: Xây dựng "bánh xe" theo tỉ lệ nghịch discount
        List<String> wheel = new ArrayList<>();
        int totalRate = 0;

        for (PromotionDTO p : selectedPromotions)
        {
            double discount = p.getDiscountValue();
            if (discount <= 0.0) continue; // bỏ qua nếu giảm giá sai

            double weight = (1.0 / discount) / totalInverse * 100.0;
            int rate = (int) Math.round(weight);

            totalRate += rate;
            for (int i = 0; i < rate; i++) {
                wheel.add(p.getPromotionCode());
            }
        }

        // ✅ Bước 3: Thêm "chúc may mắn lần sau" nếu còn dư
        int remaining = 100 - totalRate;
        for (int i = 0; i < remaining; i++) {
            wheel.add("NONE");
        }

        // ✅ Bước 4: Quay ngẫu nhiên
        Collections.shuffle(wheel); // làm ngẫu nhiên hơn
        String resultCode = wheel.get(new Random().nextInt(wheel.size()));

        // ✅ Bước 5: Lưu lịch sử quay
        if (!resultCode.equals("NONE")) {
            // Lưu mã vào ngân hàng mã người dùng
            UserPromotion userPromotion = new UserPromotion();
            userPromotion.setUserId(userId);
            userPromotion.setPromotionCode(resultCode);
            userPromotion.setStatus("active");
            userPromotion.setAssignedDate(today);
            userPromotionDAO.save(userPromotion); // Gọi DAO để lưu
        }

        // ✅ Bước 6: Trả kết quả
        Map<String, Object> result = new HashMap<>();
        result.put("promotion", resultCode.equals("NONE") ? null : getPromotionByCode(resultCode));
        result.put("message", resultCode.equals("NONE")
                ? "Chúc may mắn lần sau!"
                : "Bạn đã nhận được mã giảm giá: " + resultCode);
        return result;
    }

    public boolean applyPromotionCode(int userId, String code) {
        UserPromotion up = userPromotionDAO.findActiveByUserIdAndCode(userId, code);
        if (up == null) {
            throw new RuntimeException("Mã không hợp lệ hoặc đã sử dụng");
        }

        // Đánh dấu đã sử dụng
        up.setStatus("used");
        userPromotionDAO.update(up);

        // Có thể trả lại thông tin giảm giá để áp dụng đơn hàng
        return true;
    }
    public void expireOldUserPromotions() {
        List<UserPromotion> allActive = userPromotionDAO.getAllActivePromotions();
        for (UserPromotion up : allActive) {
            PromotionDTO promo = promotionService.getPromotionByCode(up.getPromotionCode());
            if (promo.getEndDate().isBefore(LocalDate.now())) {
                up.setStatus("expired");
                userPromotionDAO.update(up);
            }
        }
    }


}