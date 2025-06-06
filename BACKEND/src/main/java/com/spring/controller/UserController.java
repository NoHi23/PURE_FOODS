package com.spring.controller;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.spring.dto.UserDTO;
import com.spring.entity.User;
import com.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
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

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
        String idTokenString = request.get("token");

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier
                .Builder(new NetHttpTransport(), new JacksonFactory())
                .setAudience(Collections.singletonList("602510909514-3anvf6bogbdlpectj2r72qicjp7fa21a.apps.googleusercontent.com"))
                .build();

        GoogleIdToken idToken;
        try {
            idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                String email = payload.getEmail();
                String name = (String) payload.get("name");

                // Tạo user nếu chưa có
                UserDTO userDTO = userService.autoRegisterIfNotExists(name, email);

                // Có thể trả JWT token nếu dùng
                return ResponseEntity.ok(userDTO);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid ID token");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed");
        }
    }






}
