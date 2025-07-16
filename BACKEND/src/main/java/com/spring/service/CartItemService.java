package com.spring.service;

import com.spring.dto.CartItemDTO;
import java.util.List;

public interface CartItemService {
    CartItemDTO getCartItemById(Long id);
    List<CartItemDTO> getCartItemsByUserId(Long userId);
    CartItemDTO createCartItem(CartItemDTO dto);
    CartItemDTO updateCartItem(Long id, CartItemDTO dto);
    void deleteCartItem(Long id);
}
