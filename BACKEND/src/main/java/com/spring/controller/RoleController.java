package com.spring.controller;


import com.spring.dto.RoleDTO;
import com.spring.dto.SuppliersDTO;
import com.spring.dto.UserDTO;
import com.spring.service.RoleService;
import com.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/role")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class RoleController {

    @Autowired
    private RoleService roleService;


    @GetMapping("/getAll")
    public ResponseEntity<?> getAllRoles() {
        try{
            List<RoleDTO> roleDTOList = roleService.getAllRole();
            Map<String, Object> response = new HashMap<>();
            response.put("roleList", roleDTOList);
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoleDTO> getRoleById(@PathVariable("id") int id) {
        try {
            RoleDTO roleDTO = roleService.getRoleById(id);
            return ResponseEntity.ok(roleDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/delete")
    public ResponseEntity<?> deleteRole(@RequestBody RoleDTO roleDTO) {
        try {
            RoleDTO updatedRole = roleService.deleteRole(roleDTO.getRoleID());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Role deleted successfully!");
            response.put("status", 200);
            response.put("role", updatedRole);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }


    @PostMapping("/add")
    public ResponseEntity<?> addRole(@RequestBody RoleDTO roleDTO) {
        try {
            RoleDTO r = roleService.addRole(roleDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "add Role successfully!");
            response.put("status", 200);
            response.put("role", r);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }


    @PutMapping("/update")
    public ResponseEntity<?> updateRole(@RequestBody RoleDTO roleDTO) {
        try {
            RoleDTO updatedRole = roleService.updateRole(roleDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Role updated successfully!");
            response.put("status", 200);
            response.put("role", updatedRole);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}
