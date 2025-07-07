package com.spring.service.Impl;

import com.spring.dao.CartItemDAO;
import com.spring.dto.CartItemDTO;
import com.spring.entity.CartItem;
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

    @Override
    public CartItemDTO getCartItemById(Long id) {
        CartItem entity = cartItemDAO.getCartItemById(id);
        if (entity == null) {
            throw new RuntimeException("CartItem not found");
        }
        return convertToDTO(entity);
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
        return convertToDTO(cartItemDAO.createCartItem(item));
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
        return convertToDTO(cartItemDAO.updateCartItem(existing));
    }

    @Override
    public void deleteCartItem(Long id) {
        cartItemDAO.deleteCartItem(id);
    }

    private CartItemDTO convertToDTO(CartItem item) {
        CartItemDTO dto = new CartItemDTO();
        dto.setCartItemID(item.getCartItemID());
        dto.setProductID(item.getProductID());
        dto.setQuantity(item.getQuantity());
        // các trường như productName, price, total để frontend hoặc JOIN xử lý thêm
        return dto;
    }

    private CartItem convertToEntity(CartItemDTO dto) {
        CartItem item = new CartItem();
        item.setCartItemID(dto.getCartItemID());
        item.setProductID(dto.getProductID());
        item.setQuantity(dto.getQuantity());
        return item;
    }
}
