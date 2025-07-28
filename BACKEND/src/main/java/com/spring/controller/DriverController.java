package com.spring.controller;

import com.spring.dto.DriverDTO;
import com.spring.entity.Driver;
import com.spring.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @GetMapping
    public ResponseEntity<List<DriverDTO>> getAll() {
        try {
            List<Driver> drivers = driverService.findAll();
            List<DriverDTO> driverDTOs = drivers.stream().map(this::convertToDTO).collect(Collectors.toList());
            return ResponseEntity.ok(driverDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DriverDTO> getById(@PathVariable Long id) {
        try {
            Driver driver = driverService.findById(id);
            if (driver == null) {
                return ResponseEntity.status(404).body(null);
            }
            return ResponseEntity.ok(convertToDTO(driver));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<DriverDTO> create(@RequestBody DriverDTO dto) {
        try {
            if (!isValidInput(dto)) {
                return ResponseEntity.status(400).body(null);
            }
            Driver driver = convertToEntity(dto);
            driverService.save(driver);
            return ResponseEntity.ok(convertToDTO(driver));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<DriverDTO> updateDriver(@PathVariable("id") Long id, @RequestBody DriverDTO dto) {
        try {
            if (!isValidInput(dto)) {
                return ResponseEntity.status(400).body(null);
            }
            Driver existingDriver = driverService.findById(id);
            if (existingDriver == null) {
                return ResponseEntity.status(404).body(null);
            }
            Driver driver = convertToEntity(dto);
            driver.setDriverId(id);
            driverService.save(driver);
            return ResponseEntity.ok(convertToDTO(driver));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        try {
            Driver driver = driverService.findById(id);
            if (driver == null) {
                return ResponseEntity.status(404).body("Driver not found.");
            }
            driverService.delete(id);
            return ResponseEntity.ok("Driver deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete driver: " + e.getMessage());
        }
    }

    private boolean isValidInput(DriverDTO dto) {
        if (dto == null ||
                dto.getDriverName() == null || dto.getDriverName().trim().isEmpty() ||
                dto.getPhone() == null || dto.getPhone().trim().isEmpty() ||
                dto.getVehicleInfo() == null || dto.getVehicleInfo().trim().isEmpty()) {
            return false;
        }
        // Kiểm tra định dạng phone (10 chữ số)
        if (!Pattern.matches("\\d{10}", dto.getPhone())) {
            return false;
        }
        // Kiểm tra email nếu có
        if (dto.getEmail() != null && !dto.getEmail().isEmpty() &&
                !Pattern.matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", dto.getEmail())) {
            return false;
        }
        // Kiểm tra status
        if (dto.getStatus() != null && !(dto.getStatus() == 0 || dto.getStatus() == 1)) {
            return false;
        }
        return true;
    }

    private DriverDTO convertToDTO(Driver driver) {
        return new DriverDTO(
                driver.getDriverId(),
                driver.getDriverName(),
                driver.getPhone(),
                driver.getEmail(),
                driver.getVehicleNumber(),
                driver.getStatus()
        );
    }

    private Driver convertToEntity(DriverDTO dto) {
        Driver driver = new Driver();
        driver.setDriverName(dto.getDriverName());
        driver.setPhone(dto.getPhone());
        driver.setEmail(dto.getEmail());
        driver.setVehicleNumber(dto.getVehicleInfo());
        driver.setStatus(dto.getStatus());
        return driver;
    }
}