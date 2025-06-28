package com.spring.service.Impl;

import com.spring.dao.UserDAO;
import com.spring.dao.WishlistDAO;
import com.spring.dto.UserDTO;
import com.spring.dto.WishlistDTO;
import com.spring.entity.User;
import com.spring.entity.Wishlist;
import com.spring.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional(propagation = Propagation.REQUIRED)
public class WishlistServiceImpl implements WishlistService {
    @Autowired
    private WishlistDAO wishlistDAO;

    @Override
    public WishlistDTO addUWishlist(WishlistDTO wishlist) {
        Wishlist w = new Wishlist();
        w.setUserId(wishlist.getUserId());
        w.setProductId(wishlist.getProductId());
        wishlist.setCreatedAt(new java.sql.Timestamp(new Date().getTime()));
        wishlistDAO.addWishlist(w);
        return convertToDTO(w);
    }

    private WishlistDTO convertToDTO(Wishlist wishlist) {
        return new WishlistDTO(
                wishlist.getWishlistId(),
                wishlist.getUserId(),
                wishlist.getProductId(),
                wishlist.getCreatedAt()
        );
    }

    @Override
    public boolean deleteWishlist(int wishlistId) {
        Wishlist wishlist = wishlistDAO.getWishlistById(wishlistId);
        if (wishlist == null) {
            throw new RuntimeException("Wishlist not found!");
        }
        wishlistDAO.deleteWishList(wishlistId);
        return true;
    }

    @Override
    public int getTotalWishlists(int userId) {
        return wishlistDAO.countWishlist(userId);
    }

    @Override
    public List<WishlistDTO> getAllWishlistsByUser(int userId) {
        List<Wishlist> wishlistList = wishlistDAO.getWishlistByUserID(userId);
        if (wishlistList == null) {
            throw new RuntimeException("Wishlist not found!");
        }
        List<WishlistDTO> wishListDTOList = new ArrayList<>();
        for (Wishlist wishlist : wishlistList) {
            wishListDTOList.add(convertToDTO(wishlist));
        }
        return wishListDTOList;
    }

}
