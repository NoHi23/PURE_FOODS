package com.spring.controller;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.spring.dto.ProductDTO;
import com.spring.dto.UserDTO;
import com.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
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
            if (user.getStatus() == 1) {
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
                if (userDTO.getStatus() == 1) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(Map.of("message", "Tài khoản đã bị khóa hoặc không được phép đăng nhập!", "status", 403));
                }
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

    @PostMapping("/facebook")
    public ResponseEntity<?> facebookLogin(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Kiểm tra accessToken
            String accessToken = request.get("accessToken");
            if (accessToken == null || accessToken.isEmpty()) {
                response.put("message", "Access token is missing");
                return ResponseEntity.badRequest().body(response);
            }

            // Gọi Facebook Graph API
            URL url = new URL("https://graph.facebook.com/me?fields=id,name,email&access_token=" + accessToken);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            int responseCode = connection.getResponseCode();
            System.out.println("responseCode : " + responseCode);
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(responseCode == 200 ? connection.getInputStream() : connection.getErrorStream())
            );

            StringBuilder jsonBuilder = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                jsonBuilder.append(line);
            }
            System.out.println("line : " + jsonBuilder.toString());
            reader.close();

            if (responseCode != 200) {
                response.put("message", "Invalid Facebook token");
                response.put("facebookError", jsonBuilder.toString());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // Parse JSON response
            ObjectMapper mapper = new ObjectMapper();
            System.out.println("Before parsing JSON...");
//            JsonNode jsonNode = mapper.readTree(jsonBuilder.toString());
            Map<String, String> fbData = mapper.readValue(jsonBuilder.toString(), new TypeReference<Map<String, String>>() {});
            System.out.println("Parsed name: " + fbData.get("name"));
            System.out.println("Parsed email: " + fbData.get("email"));


//            String name = jsonNode.has("name") ? jsonNode.get("name").asText() : null;
//            String email = jsonNode.has("email") ? jsonNode.get("email").asText() : null;
            String name = (String) fbData.get("name");
            String email = (String) fbData.get("email");
            System.out.println("email: " + email);
            System.out.println("name: " + name);
            if (email == null || email.isEmpty()) {
                response.put("message", "Email permission is required in Facebook login.");
                return ResponseEntity.badRequest().body(response);
            }

            UserDTO userDTO = userService.autoRegisterIfNotExists(name, email);
            if (userDTO == null) {
                response.put("message", "User registration failed.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
            if (userDTO.getStatus() == 1) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Tài khoản đã bị khóa hoặc không được phép đăng nhập!", "status", 403));
            }

            response.put("message", "Login successful");
            response.put("user", userDTO);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            e.printStackTrace();
            response.put("message", "Facebook API connection failed");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("message", "Unexpected error during Facebook login");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody UserDTO userDTO) {
        try {
            UserDTO updatedUser = userService.updateInfo(userDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User updated successfully!");
            response.put("status", 200);
            response.put("user", updatedUser);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PutMapping("/delete")
    public ResponseEntity<?> deleteUser(@RequestBody UserDTO userDTO) {
        try {
            boolean updatedUser = userService.deleteUser(userDTO.getUserId());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User deleted successfully!");
            response.put("status", 200);
            response.put("user", updatedUser);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> getTotalUser() {
        try{
            int totalUser = userService.getTotalUsers();
            Map<String, Object> response = new HashMap<>();
            response.put("totalUser", totalUser);
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllUser() {
        try{
            List<UserDTO> userDTOList = userService.getAllUsers();
            Map<String, Object> response = new HashMap<>();
            response.put("userList", userDTOList);
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        Map<String, Object> response = new HashMap<>();

        try {
            boolean result = userService.sendResetPasswordEmail(email);
            if (result) {
                response.put("message", "Reset password email sent successfully.");
                response.put("status", 200);
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Email not found.");
                response.put("status", 404);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            response.put("message", "Error: " + e.getMessage());
            response.put("status", 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        String newPassword = payload.get("newPassword");
        Map<String, Object> response = new HashMap<>();

        try {
            boolean result = userService.resetPassword(token, newPassword);
            if (result) {
                response.put("message", "Password reset successfully.");
                response.put("status", 200);
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Invalid or expired token.");
                response.put("status", 400);
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("message", "Error: " + e.getMessage());
            response.put("status", 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyResetToken(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        boolean valid = userService.verifyResetToken(token);

        if (valid) {
            return ResponseEntity.ok(Map.of("message", "OTP hợp lệ", "status", 200));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "OTP không hợp lệ hoặc đã hết hạn", "status", 400));
        }
    }


    @PostMapping("/add")
    public ResponseEntity<?> addUser(@RequestBody UserDTO userDTO) {
        try {
            UserDTO u = userService.addUser(userDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "add User successfully!");
            response.put("status", 200);
            response.put("user", u);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

}
