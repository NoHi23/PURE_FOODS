package com.spring.dao;

import com.spring.entity.CartItem;
import java.util.List;

public interface CartItemDAO {
    CartItem getCartItemById(Long id);
    List<CartItem> getCartItemsByUserId(Long userId);
    CartItem createCartItem(CartItem cartItem);
    CartItem updateCartItem(CartItem cartItem);
    void deleteCartItem(Long id);
}
