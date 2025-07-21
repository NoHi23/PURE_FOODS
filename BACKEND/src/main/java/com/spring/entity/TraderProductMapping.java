package com.spring.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "TraderProductMapping")
public class TraderProductMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private int userId;  // Người tạo mapping

    @Column(nullable = false)
    private int productId; // ProductId của Importer

    @Column(nullable = false)
    private int traderProductId; // ProductId của Trader (sản phẩm tương ứng)

    public TraderProductMapping() {}

    public TraderProductMapping(int userId, int productId, int traderProductId) {
        this.userId = userId;
        this.productId = productId;
        this.traderProductId = traderProductId;
    }

    public int getId() {
        return id;
    }

    public int getUserId() {
        return userId;
    }

    public int getProductId() {
        return productId;
    }

    public int getTraderProductId() {
        return traderProductId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public void setTraderProductId(int traderProductId) {
        this.traderProductId = traderProductId;
    }
}
