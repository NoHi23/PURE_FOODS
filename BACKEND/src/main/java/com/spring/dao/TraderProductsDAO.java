package com.spring.dao;

import com.spring.entity.TraderProducts;
import java.util.List;

public interface TraderProductsDAO {
    TraderProducts getTraderProductById(int id);
    List<TraderProducts> getAllTraderProducts();
    TraderProducts createTraderProduct(TraderProducts traderProduct);
    TraderProducts updateTraderProduct(TraderProducts traderProduct);
    void deleteTraderProduct(int id);

    // Thêm phương thức getLatestTraderProduct
    TraderProducts getLatestTraderProduct();
}