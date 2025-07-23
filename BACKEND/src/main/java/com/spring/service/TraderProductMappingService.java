package com.spring.service;

import com.spring.dto.TraderProductMappingDTO;
import java.util.List;


public interface TraderProductMappingService {
    TraderProductMappingDTO createMapping(int userId, int productId, int traderProductId);

    TraderProductMappingDTO getMappingByProductId(int productId);

    TraderProductMappingDTO getMappingByTraderProductId(int traderProductId);

    void deleteMappingById(int mappingId);

    List<TraderProductMappingDTO> getAllMappings();

}

