package com.spring.controller;

import com.spring.dto.CartItemDTO;
import com.spring.service.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CartItemController {

    @Autowired
    private CartItemService cartItemService;

    @GetMapping("/{id}")
    public ResponseEntity<CartItemDTO> getCartItemById(@PathVariable("id") Long id) {
        try {
            CartItemDTO dto = cartItemService.getCartItemById(id);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CartItemDTO>> getCartItemsByUserId(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(cartItemService.getCartItemsByUserId(userId));
    }

    @PostMapping("/create")
    public ResponseEntity<CartItemDTO> createCartItem(@RequestBody CartItemDTO dto) {
        return ResponseEntity.ok(cartItemService.createCartItem(dto));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CartItemDTO> updateCartItem(@PathVariable("id") Long id,
                                                      @RequestBody CartItemDTO dto) {
        try {
            return ResponseEntity.ok(cartItemService.updateCartItem(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable("id") Long id) {
        try {
            cartItemService.deleteCartItem(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
