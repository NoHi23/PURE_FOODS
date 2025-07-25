package com.spring.service.Impl;

import com.spring.dao.PromotionDAO;
import com.spring.dao.UserPromotionDAO;
import com.spring.dto.PromotionDTO;
import com.spring.entity.Notifications;
import com.spring.entity.Promotions;
import com.spring.entity.SpinHistory;
import com.spring.entity.UserPromotion;
import com.spring.service.NotificationService;
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


    @Autowired
    private NotificationService notificationService;

    @Override
    public Map<String, Object> spinWheel(int userId) {
        LocalDate today = LocalDate.now();

        // 1. Kiểm tra đã quay hôm nay chưa
        boolean alreadySpun = promotionDAO.existsByUserIdAndDate(userId, today);
        if (alreadySpun) {
            throw new IllegalStateException("Bạn đã quay vòng hôm nay rồi!");
        }

        // 2. Lấy danh sách mã giảm giá đang hoạt động
        List<PromotionDTO> allPromotions = getAllPromotions();
        if (allPromotions.isEmpty()) {
            throw new RuntimeException("Không có mã giảm giá nào đang hoạt động!");
        }

        // 3. Chọn 5 mã giảm giá
        List<PromotionDTO> sortedPromotions = allPromotions.stream()
                .sorted(Comparator.comparingDouble(PromotionDTO::getDiscountValue))
                .collect(Collectors.toList());

        List<PromotionDTO> selectedPromotions = new ArrayList<>();
        int size = sortedPromotions.size();

        if (size >= 5) {
            selectedPromotions.add(sortedPromotions.get(0));
            selectedPromotions.add(sortedPromotions.get(1));
            int midStart = size / 2 - 1;
            selectedPromotions.add(sortedPromotions.get(midStart));
            selectedPromotions.add(sortedPromotions.get(midStart + 1));
            selectedPromotions.add(sortedPromotions.get(size - 1));
        } else {
            selectedPromotions.addAll(sortedPromotions);
        }

        // 4. Tính tổng tỉ lệ nghịch của discount
        double totalInverse = selectedPromotions.stream()
                .filter(p -> p.getDiscountValue() > 0)
                .mapToDouble(p -> 1.0 / p.getDiscountValue())
                .sum();

        List<String> wheel = new ArrayList<>(); // dùng cho quay
        List<String> wheelDescriptions = new ArrayList<>(); // dùng để gửi về FE
        Map<String, String> codeToDescription = new HashMap<>();

        int totalRate = 0;

        for (PromotionDTO p : selectedPromotions) {
            double discount = p.getDiscountValue();
            if (discount <= 0.0) continue;

            double weight = (1.0 / discount) / totalInverse * 100.0;
            int rate = (int) Math.round(weight);

            totalRate += rate;
            for (int i = 0; i < rate; i++) {
                wheel.add(p.getPromotionCode());
            }

            codeToDescription.put(p.getPromotionCode(), p.getDescription());
        }

        // 5. Thêm "NONE" nếu còn dư
        int remaining = 100 - totalRate;
        for (int i = 0; i < remaining; i++) {
            wheel.add("NONE");
        }
        codeToDescription.put("NONE", "❌ Chúc bạn may mắn lần sau!");

        // 6. Quay ngẫu nhiên
        Collections.shuffle(wheel);
        String resultCode = wheel.get(new Random().nextInt(wheel.size()));

        // 7. Lưu lịch sử nếu trúng
        if (!"NONE".equals(resultCode)) {
            UserPromotion userPromotion = new UserPromotion();
            userPromotion.setUserId(userId);
            userPromotion.setPromotionCode(resultCode);
            userPromotion.setStatus("active");
            userPromotion.setAssignedDate(today);
            userPromotionDAO.save(userPromotion);
        }

        // 8. Trả kết quả
        Map<String, Object> result = new HashMap<>();
        result.put("promotion", "NONE".equals(resultCode) ? null : getPromotionByCode(resultCode));
        result.put("message", "NONE".equals(resultCode)
                ? "Chúc may mắn lần sau!"
                : "Bạn đã nhận được mã giảm giá: " + resultCode);


        Notifications notify = new Notifications();
        notify.setUserId(userId);
        notify.setTitle("Vòng quay may mắn!");
        notify.setContent("Chúc mừng bạn đã nhận được mã giảm giá: " + resultCode);
        notificationService.saveNotification(notify);
        // Đảm bảo không trùng description hiển thị
        Set<String> uniqueDescriptions = wheel.stream()
                .map(code -> codeToDescription.getOrDefault(code, code))
                .collect(Collectors.toCollection(LinkedHashSet::new));

        result.put("wheelItems", new ArrayList<>(uniqueDescriptions));
        return result;
    }


    public boolean applyPromotionCode(int userId, String code) {
        UserPromotion up = userPromotionDAO.findActiveByUserIdAndCode(userId, code);
        if (up == null) {
            throw new RuntimeException("Mã không hợp lệ hoặc đã sử dụng");
        }

        up.setStatus("used");
        userPromotionDAO.update(up);

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

    @Override
    public List<PromotionDTO> getPromotionsByUserId(int userId) {
        List<String> promotionCodes = promotionDAO.findPromotionCodesByUserId(userId);
        List<PromotionDTO> result = new ArrayList<>();

        for (String code : promotionCodes) {
            PromotionDTO dto = getPromotionByCode(code);
            if (dto != null) {
                result.add(dto);
            }
        }

        return result;
    }


}