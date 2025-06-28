package com.spring.dao;

import com.spring.entity.User;
import com.spring.entity.Wishlist;

import java.util.List;

public interface WishlistDAO {
    Wishlist addWishlist(Wishlist wishlist);
    void deleteWishList(int id);
    List<Wishlist> getWishlistByUserID(int userID);
    int countWishlist(int userID);
    Wishlist getWishlistById(int id);
}
