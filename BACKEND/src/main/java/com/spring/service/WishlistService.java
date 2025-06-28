package com.spring.service;

import com.spring.dto.UserDTO;
import com.spring.dto.WishlistDTO;

import java.util.List;

public interface WishlistService {
    WishlistDTO addUWishlist(WishlistDTO wishlist);
    boolean deleteWishlist(int wishlistId);
    int getTotalWishlists(int userId);
    List<WishlistDTO> getAllWishlistsByUser(int userId);

}
