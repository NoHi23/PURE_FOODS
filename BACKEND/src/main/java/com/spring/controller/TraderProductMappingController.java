package com.spring.controller;

import com.spring.dto.TraderProductMappingDTO;
import com.spring.service.TraderProductMappingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trader-product-mapping")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TraderProductMappingController {

    @Autowired
    private TraderProductMappingService traderProductMappingService;

    // Tạo mapping giữa userId, productId và traderProductId
    @PostMapping("/create")
    public ResponseEntity<?> createMapping(
            @RequestParam(name = "userId") Integer userId,
            @RequestParam(name = "productId") Integer productId,
            @RequestParam(name = "traderProductId") Integer traderProductId) {
        try {
            TraderProductMappingDTO dto = traderProductMappingService.createMapping(userId, productId, traderProductId);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Failed to create mapping: " + e.getMessage());
        }
    }

    // Lấy mapping theo productId của Importer
    @GetMapping("/by-product/{productId}")
    public ResponseEntity<?> getByProductId(@PathVariable("productId") Integer productId) {
        TraderProductMappingDTO dto = traderProductMappingService.getMappingByProductId(productId);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }

    // Lấy mapping theo traderProductId
    @GetMapping("/by-trader-product/{traderProductId}")
    public ResponseEntity<?> getByTraderProductId(@PathVariable("traderProductId") Integer traderProductId) {
        TraderProductMappingDTO dto = traderProductMappingService.getMappingByTraderProductId(traderProductId);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }

    // Xóa mapping theo id
    @DeleteMapping("/delete/{mappingId}")
    public ResponseEntity<?> deleteMapping(@PathVariable("mappingId") Integer mappingId) {
        try {
            traderProductMappingService.deleteMappingById(mappingId);
            return ResponseEntity.ok("Deleted mapping id=" + mappingId);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Failed to delete mapping: " + e.getMessage());
        }
    }
    @GetMapping("/get-all")
    public ResponseEntity<?> getAllMappings() {
        try {
            return ResponseEntity.ok().body(traderProductMappingService.getAllMappings());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get all mappings: " + e.getMessage());
        }
    }


}
