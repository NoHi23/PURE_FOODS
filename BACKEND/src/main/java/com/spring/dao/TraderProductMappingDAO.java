package com.spring.dao;

import com.spring.entity.TraderProductMapping;
import java.util.List;
public interface TraderProductMappingDAO {
    void save(TraderProductMapping mapping);

    TraderProductMapping findByProductId(int productId);

    TraderProductMapping findByTraderProductId(int traderProductId);

    void deleteById(int mappingId);
    TraderProductMapping getByProductIdAndTraderId(int productId, int traderId);
    List<TraderProductMapping> findAll();
}




