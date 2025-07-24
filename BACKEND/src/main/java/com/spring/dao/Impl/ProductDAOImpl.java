package com.spring.dao.Impl;

import com.spring.dao.ProductDAO;
import com.spring.entity.ProductDetails;
import com.spring.entity.Products;
import com.spring.entity.*;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public class ProductDAOImpl implements ProductDAO {
    @Autowired
    private SessionFactory sessionFactory;
    @Override
    public List<Products> getAllProduct() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("from Products").list();
    }

    @Override
    public Products getProductById(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(Products.class, id);
    }

    @Override
    public Products addProduct(Products product) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(product);
        return product;
    }

    @Override
    public Products updateProduct(Products product) {
        Session session = sessionFactory.getCurrentSession();
        session.update(product);
        return product;
    }

    @Override
    public void deleteProduct(int id) {
        Session session = sessionFactory.getCurrentSession();
        Products product = session.get(Products.class, id);
        session.delete(product);
    }

    @Override
    public int countProduct() {
        Session session = sessionFactory.getCurrentSession();
        Query query = session.createQuery("select count(*) from Products");
        return ((Long) ((org.hibernate.query.Query<?>) query).uniqueResult()).intValue();
    }

    @Override
    public void addProductDetails(ProductDetails productDetails) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(productDetails);
    }

    @Override
    public void updateProductOrganicInfo(int productId, int organicStatusId) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "UPDATE ProductOrganicInfo SET organicStatusId = :organicStatusId WHERE productId = :productId";
        session.createQuery(hql)
                .setParameter("organicStatusId", organicStatusId)
                .setParameter("productId", productId)
                .executeUpdate();
    }

    @Override
    public ProductDetails getProductDetailsById(int productId) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(ProductDetails.class, productId);
    }
    public Products findById(int id) {
        return getProductById(id);
    }
    @Override
    public Products save(Products product) {
        Session session = sessionFactory.getCurrentSession();
        if (product.getProductId() == 0) {
            session.persist(product); // Thêm mới
        } else {
            session.merge(product); // Cập nhật
        }
        return product;
    }



    @Override
    public List<Products> getProductByStatus(int status) {
        String hql = "FROM Products WHERE status = :status";
        return sessionFactory.getCurrentSession()
                .createQuery(hql, Products.class)
                .setParameter("status", status)
                .getResultList();
    }

    @Override
    public List<Products> getTopDiscountProducts(int limit) {
        String hql = "FROM Products WHERE status = 0 ORDER BY discountPercent DESC";
        return sessionFactory.getCurrentSession()
                .createQuery(hql, Products.class)
                .setMaxResults(limit)
                .getResultList();
    }


    @Override
    public Page<Products> searchProducts(String keyword,
                                         Integer categoryId,
                                         Integer supplierId,
                                         Integer minDiscount,
                                         Pageable pageable) {
        Session session = sessionFactory.getCurrentSession();

        StringBuilder hql = new StringBuilder("FROM Products p WHERE 1=1 ");
        StringBuilder countHql = new StringBuilder("SELECT COUNT(p) FROM Products p WHERE 1=1 ");

        if (keyword != null && !keyword.trim().isEmpty()) {
            hql.append("AND LOWER(p.productName) LIKE :keyword ");
            countHql.append("AND LOWER(p.productName) LIKE :keyword ");
        }
        if (categoryId != null) {
            hql.append("AND p.categoryId = :categoryId ");
            countHql.append("AND p.categoryId = :categoryId ");
        }
        if (supplierId != null) {
            hql.append("AND p.supplierId = :supplierId ");
            countHql.append("AND p.supplierId = :supplierId ");
        }
        if (minDiscount != null) {
            hql.append("AND p.discountPercent >= :minDiscount ");
            countHql.append("AND p.discountPercent >= :minDiscount ");
        }

        hql.append("ORDER BY p.discountPercent DESC, p.productId DESC");

        // Query dữ liệu
        Query query = session.createQuery(hql.toString(), Products.class);
        // Query tổng số dòng
        Query countQuery = session.createQuery(countHql.toString());

        if (keyword != null && !keyword.trim().isEmpty()) {
            query.setParameter("keyword", "%" + keyword.toLowerCase() + "%");
            countQuery.setParameter("keyword", "%" + keyword.toLowerCase() + "%");
        }
        if (categoryId != null) {
            query.setParameter("categoryId", categoryId);
            countQuery.setParameter("categoryId", categoryId);
        }
        if (supplierId != null) {
            query.setParameter("supplierId", supplierId);
            countQuery.setParameter("supplierId", supplierId);
        }
        if (minDiscount != null) {
            query.setParameter("minDiscount", minDiscount);
            countQuery.setParameter("minDiscount", minDiscount);
        }

        // Áp dụng phân trang từ Pageable
        int page = pageable.getPageNumber();
        int size = pageable.getPageSize();

        query.setFirstResult(page * size);
        query.setMaxResults(size);

        List<Products> resultList = query.getResultList();
        long total = (long) countQuery.getSingleResult(); // Tổng số kết quả

        return new PageImpl<>(resultList, pageable, total);
    }

    @Override
    public List<Products> getProductsByCategory(int categoryId) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "FROM Products WHERE categoryId = :categoryId";
        Query query = session.createQuery(hql);
        query.setParameter("categoryId", categoryId);
        return query.getResultList();
    }

    @Override
    public List<Products> getRelatedProducts(int productId) {
        Session session = sessionFactory.getCurrentSession();

        // Lấy sản phẩm hiện tại để biết categoryId
        Products currentProduct = session.get(Products.class, productId);
        if (currentProduct == null) {
            throw new RuntimeException("Product not found with id: " + productId);
        }

        int categoryId = currentProduct.getCategoryId(); // nếu bạn dùng quan hệ thì dùng: currentProduct.getCategory().getCategoryId()

        // Lấy các sản phẩm cùng category nhưng khác productId hiện tại
        String hql = "FROM Products WHERE categoryId = :categoryId AND productId != :productId";
        Query query = session.createQuery(hql, Products.class);
        query.setParameter("categoryId", categoryId);
        query.setParameter("productId", productId);

        return query.getResultList();
    }
}
