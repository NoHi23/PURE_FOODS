package com.spring.controller;

import com.spring.entity.Drivers;
import com.spring.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    @Autowired
    private DriverRepository driverRepository;

    @GetMapping
    public ResponseEntity<List<Drivers>> getAllDrivers() {
        return ResponseEntity.ok(driverRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Drivers> getDriverById(@PathVariable("id") Integer id) {
        Optional<Drivers> driver = driverRepository.findById(id);
        return driver.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Drivers> createDriver(@RequestBody Drivers driver) {
        Drivers saved = driverRepository.save(driver);
        return ResponseEntity.ok(saved);
    }


}