package com.spring.controller;
import com.spring.dto.UserDTO;
import com.spring.entity.User;
import com.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userDTO) {
        boolean isAuthenticated = userService.login(userDTO);
        UserDTO user = userService.findByEmail(userDTO.getEmail());
        Map<String, Object> response = new HashMap<>();

        if (isAuthenticated) {
            if (user.getStatus() == 0) {
                response.put("message", "Tài khoản đã bị khóa hoặc không được phép đăng nhập!");
                response.put("status", 403); // Forbidden
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }
            response.put("message", "Login successful!");
            response.put("status", 200);
            response.put("user", user);
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Invalid email or password!");
            response.put("status", 201);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        Map<String, Object> response = new HashMap<>();
        try {
            UserDTO newUser = userService.register(userDTO.getFullName(), userDTO.getEmail(), userDTO.getPhone(), userDTO.getPassword(), userDTO.getAddress());
            response.put("message", "Register successful!");
            response.put("userId", newUser.getUserId());
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("message", e.getMessage());
            response.put("status", 202);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            response.put("message", "Error during registration: " + e.getMessage());
            response.put("status", 201);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }








}
