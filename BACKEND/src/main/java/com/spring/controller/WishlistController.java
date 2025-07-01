package com.spring.controller;


import com.spring.dto.ProductDTO;
import com.spring.dto.UserDTO;
import com.spring.dto.WishlistDTO;
import com.spring.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class WishlistController {
    @Autowired
    private WishlistService wishlistService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getAllWishlistsByUser(@PathVariable("userId") int userId) {
        try {
            List<WishlistDTO> wishlists = wishlistService.getAllWishlistsByUser(userId);
            return ResponseEntity.ok(wishlists);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    @PostMapping("/add")
    public ResponseEntity<?> addWishlist(@RequestBody WishlistDTO wishlistDTO) {
        try {
            WishlistDTO p = wishlistService.addUWishlist(wishlistDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Add to Wishlist successfully!");
            response.put("status", 200);
            response.put("wishlist", p);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/count/{userId}")
    public ResponseEntity<?> getTotalWishlists(@PathVariable("userId") int userId) {
        try{
            int totalWishlist = wishlistService.getTotalWishlists(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("totalWishlist", totalWishlist);
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PutMapping("/delete")
    public ResponseEntity<?> deleteWishlist(@RequestBody WishlistDTO wishlistDTO) {
        try {
            boolean deleteWishlist = wishlistService.deleteWishlist(wishlistDTO.getWishlistId());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Wishlist deleted successfully!");
            response.put("status", 200);
            response.put("wishlist", deleteWishlist);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}
