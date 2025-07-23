package com.spring.service.Impl;

import com.spring.dao.CartItemDAO;
import com.spring.dao.ProductDAO;
import com.spring.dto.CartItemDTO;
import com.spring.entity.CartItem;
import com.spring.entity.Products;
import com.spring.service.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(propagation = Propagation.REQUIRED)
public class CartItemServiceImpl implements CartItemService {

    @Autowired
    private CartItemDAO cartItemDAO;

    @Autowired
    private ProductDAO productDAO;

    @Override
    public CartItemDTO getCartItemById(Long id) {
        CartItem item = cartItemDAO.getCartItemById(id);
        if (item == null) {
            throw new RuntimeException("CartItem not found");
        }

        CartItemDTO dto = convertToDTO(item);
        if (dto == null) {
            throw new RuntimeException("Không thể convert CartItemID = " + id);
        }

        return dto;
    }


    @Override
    public List<CartItemDTO> getCartItemsByUserId(Long userID) {
        List<CartItem> cartItems = cartItemDAO.getCartItemsByUserId(userID);

        return cartItems.stream().map(cartItem -> {
            Products product = productDAO.getProductById(cartItem.getProductID().intValue());
            if (product == null) {
                System.err.println("⚠️ Không tìm thấy sản phẩm cho ID " + cartItem.getProductID());
                return null;
            }

            CartItemDTO dto = new CartItemDTO();
            dto.setCartItemID(cartItem.getCartItemID());
            dto.setQuantity(cartItem.getQuantity());
            dto.setUserID(cartItem.getUserID());
            dto.setProductID(cartItem.getProductID());
            dto.setProductName(product.getProductName());
            dto.setImageURL(product.getImageURL());
            dto.setPriceAfterDiscount(product.getPriceAfterDiscount());
            dto.setOriginalPrice(product.getPrice());
            //dto.setDiscount(product.getDiscountPercent());
            dto.setDiscount(product.getDiscountPercent() != null ? product.getDiscountPercent() : 0f);

            float total = product.getPriceAfterDiscount() * cartItem.getQuantity();
            dto.setTotal(total);
            dto.setStock(product.getStockQuantity()); //  Cập nhật tồn kho

            return dto;

        }).filter(dto -> dto != null).collect(Collectors.toList());
    }



    @Override
    public CartItemDTO createCartItem(CartItemDTO dto) {
        // 🔍 Kiểm tra xem đã có sản phẩm đó trong giỏ hàng chưa
        CartItem existingItem = cartItemDAO.findByUserAndProduct(dto.getUserID(), dto.getProductID());

        if (existingItem != null) {
            // 🔄 Cộng dồn số lượng nếu đã có
            int newQuantity = existingItem.getQuantity() + dto.getQuantity();
            existingItem.setQuantity(newQuantity);
            existingItem.setAddedAt(LocalDateTime.now());

            CartItem updated = cartItemDAO.updateCartItem(existingItem);
            return convertToDTO(updated);
        }

        // 🆕 Nếu chưa có, tạo mới
        CartItem item = convertToEntity(dto);
        item.setAddedAt(LocalDateTime.now());
        item.setStatus(0); // ✅ 0 = Active

        CartItem created = cartItemDAO.createCartItem(item);
        return convertToDTO(created);
    }


    @Override
    public CartItemDTO updateCartItem(Long id, CartItemDTO dto) {
        CartItem existing = cartItemDAO.getCartItemById(id);
        if (existing == null) {
            throw new RuntimeException("CartItem not found");
        }

        existing.setProductID(dto.getProductID());
        existing.setQuantity(dto.getQuantity());
        existing.setAddedAt(LocalDateTime.now());

        CartItem updated = cartItemDAO.updateCartItem(existing);
        return convertToDTO(updated);
    }

    @Override
    public void deleteCartItem(Long id) {
        cartItemDAO.deleteCartItem(id);
    }

    private CartItemDTO convertToDTO(CartItem item) {
        try {
            System.out.println("🛒 Đang convert CartItemID: " + item.getCartItemID() + ", productID = " + item.getProductID());

            Products product = productDAO.getProductById(item.getProductID().intValue());

            if (product == null) {
                System.err.println("❌ Không tìm thấy sản phẩm cho productID = " + item.getProductID());
                return null;
            }

            float discountedPrice = product.getPriceAfterDiscount();
            float originalPrice = product.getPrice();
            int quantity = item.getQuantity();
            float discount = originalPrice - discountedPrice;
            float total = discountedPrice * quantity;

            CartItemDTO dto = new CartItemDTO();
            dto.setCartItemID(item.getCartItemID());
            dto.setProductID(item.getProductID());
            dto.setProductName(product.getProductName());
            dto.setImageURL(product.getImageURL());
            dto.setOriginalPrice(originalPrice);
            dto.setPriceAfterDiscount(discountedPrice);
            dto.setDiscount(discount);
            dto.setQuantity(quantity);
            dto.setTotal(total);
            dto.setUserID(item.getUserID());
            dto.setStock(product.getStockQuantity()); // Thêm stock từ entity Products

            return dto;

        } catch (Exception e) {
            System.err.println("❌ Lỗi khi convert CartItemID = " + item.getCartItemID() + ": " + e.getMessage());
            e.printStackTrace(); // 👉 để hiện chi tiết lỗi trong console
            return null;
        }
    }


    private CartItem convertToEntity(CartItemDTO dto) {
        CartItem item = new CartItem();
        item.setCartItemID(dto.getCartItemID());
        item.setProductID(dto.getProductID()); // ✅ đã là Long
        item.setQuantity(dto.getQuantity());
        item.setUserID(dto.getUserID());
        return item;
    }

    @Override
    public void clearCartByUserId(int userId) {
        cartItemDAO.deleteByUserId(userId);
    }

}
