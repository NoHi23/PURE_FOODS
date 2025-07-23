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
        List<CartItemDTO> items = cartItemService.getCartItemsByUserId(userId);
        return ResponseEntity.ok(items);
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
    public ResponseEntity<String> deleteCartItem(@PathVariable("id") Long id) {
        try {
            cartItemService.deleteCartItem(id);
            return ResponseEntity.ok("Cart item deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Cart item not found.");
        }
    }

    @GetMapping("/user/{userId}/total")
    public ResponseEntity<Float> getCartTotal(@PathVariable Long userId) {
        List<CartItemDTO> items = cartItemService.getCartItemsByUserId(userId);
        float subtotal = items.stream()
                .map(CartItemDTO::getTotal)
                .reduce(0f, Float::sum);
        float shipping = 6.90f;
        float couponDiscount = 0f;
        float total = subtotal + shipping - couponDiscount;

        return ResponseEntity.ok(total);
    }

    @DeleteMapping("/user/{userId}/clear")
    public ResponseEntity<String> clearCartByUserId(@PathVariable("userId") int userId) {
        cartItemService.clearCartByUserId(userId);
        return ResponseEntity.ok("Cart cleared successfully.");
    }

}
