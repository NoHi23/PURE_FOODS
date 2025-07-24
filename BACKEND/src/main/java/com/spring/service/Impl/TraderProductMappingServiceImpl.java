package com.spring.service.Impl;

import com.spring.dao.TraderProductMappingDAO;
import com.spring.dto.TraderProductMappingDTO;
import com.spring.entity.TraderProductMapping;
import com.spring.service.TraderProductMappingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class TraderProductMappingServiceImpl implements TraderProductMappingService {

    @Autowired
    private TraderProductMappingDAO traderProductMappingDAO;

    private TraderProductMappingDTO convertToDTO(TraderProductMapping entity) {
        if (entity == null) return null;
        TraderProductMappingDTO dto = new TraderProductMappingDTO();
        dto.setMappingId(entity.getId());
        dto.setUserId(entity.getUserId());
        dto.setProductId(entity.getProductId());
        dto.setTraderProductId(entity.getTraderProductId());
        return dto;
    }

    @Override
    public TraderProductMappingDTO createMapping(int userId, int productId, int traderProductId) {
        TraderProductMapping entity = new TraderProductMapping(userId, productId, traderProductId);
        traderProductMappingDAO.save(entity);
        return convertToDTO(entity);
    }

    @Override
    public TraderProductMappingDTO getMappingByProductId(int productId) {
        return convertToDTO(traderProductMappingDAO.findByProductId(productId));
    }

    @Override
    public TraderProductMappingDTO getMappingByTraderProductId(int traderProductId) {
        return convertToDTO(traderProductMappingDAO.findByTraderProductId(traderProductId));
    }

    @Override
    public void deleteMappingById(int mappingId) {
        traderProductMappingDAO.deleteById(mappingId);
    }
    @Override
    public List<TraderProductMappingDTO> getAllMappings() {
        List<TraderProductMapping> entityList = traderProductMappingDAO.findAll();
        return entityList.stream()
                .map(this::convertToDTO)
                .collect(java.util.stream.Collectors.toList());
    }

}
