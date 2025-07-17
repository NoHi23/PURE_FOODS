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
        return convertToDTO(item);
    }

    @Override
    public List<CartItemDTO> getCartItemsByUserId(Long userId) {
        List<CartItem> items = cartItemDAO.getCartItemsByUserId(userId);
        return items.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CartItemDTO createCartItem(CartItemDTO dto) {
        CartItem item = convertToEntity(dto);
        item.setAddedAt(LocalDateTime.now());
        item.setStatus("Active");
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
        Products product = productDAO.getProductById(item.getProductID().intValue());
        if (product == null) {
            throw new RuntimeException("Product not found for CartItem");
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

        return dto;
    }

    private CartItem convertToEntity(CartItemDTO dto) {
        CartItem item = new CartItem();
        item.setCartItemID(dto.getCartItemID());
        item.setProductID(dto.getProductID()); // ✅ đã là Long
        item.setQuantity(dto.getQuantity());
        return item;
    }
}
