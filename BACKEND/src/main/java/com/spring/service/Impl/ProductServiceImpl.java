package com.spring.service.Impl;

import com.spring.dao.NotificationDAO;
import com.spring.dao.ProductDAO;
import com.spring.dao.ProductImageDAO;
import com.spring.dao.UserDAO;
import com.spring.dto.ProductDTO;
import com.spring.entity.*;
import com.spring.service.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Pageable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(propagation = Propagation.REQUIRED)
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductDAO productDAO;
    @Autowired
    private ProductImageDAO productImageDAO;

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private NotificationDAO notificationDAO;

    @Autowired
    private ModelMapper mapper;

    @Override
    public List<ProductDTO> getAllProduct() {
        List<ProductDTO> list = new ArrayList<ProductDTO>();
        List<Products> productList = productDAO.getAllProduct();
        if (productList == null || productList.size() == 0) {
            throw new RuntimeException("Danh sách sản phẩm trống");
        }
        for (Products product : productList) {
            ProductDetails details = productDAO.getProductDetailsById(product.getProductId());
            list.add(convertToDTO(product, details));
        }
        return list;
    }

    @Override
    public ProductDTO getProductById(int id) {
        Products product = productDAO.getProductById(id);
        if (product == null) {
            throw new RuntimeException("Không tìm thấy sản phẩm");
        }
        return convertToDTO(product);
    }

    @Override
    public ProductDTO addProduct(ProductDTO product) {
        Products q = new Products();
        q.setProductName(product.getProductName());
        q.setCategoryId(product.getCategoryId());
        q.setSupplierId(product.getSupplierId());
        q.setPrice(product.getPrice());
        q.setDiscountPercent(product.getDiscountPercent());
        q.setStockQuantity(product.getStockQuantity());
        q.setDescription(product.getDescription());
        q.setImageURL(product.getImageURL());
        q.setLastUpdateBy(product.getLastUpdatedBy());
        q.setStatus(product.getStatus());
        productDAO.addProduct(q);
        if (product.getGalleryImages() != null && !product.getGalleryImages().isEmpty()) {
            for (String url : product.getGalleryImages()) {
                if (url == null || url.isEmpty()) continue;

                ProductImages image = new ProductImages();
                image.setProductId(q.getProductId());
                image.setImageUrl(url);
                image.setCreatedAt(new Timestamp(System.currentTimeMillis()));
                image.setStatus(0);;
                productImageDAO.addImage(image);
            }
        }
        return convertToDTO(q);
    }
    @Override
    public ProductDTO updateProduct(ProductDTO product) {
        Products q = productDAO.getProductById(product.getProductId());
        if (q == null) {
            throw new RuntimeException("Không tìm thấy sản phẩm");
        }

        if (product.getPrice() < 0 || product.getStockQuantity() < 0) {
            throw new IllegalArgumentException("Price and Stock must be non-negative");
        }

        q.setProductName(product.getProductName());
        q.setCategoryId(product.getCategoryId());
        q.setSupplierId(product.getSupplierId());
        q.setPrice(product.getPrice());
        q.setDiscountPercent(product.getDiscountPercent());
        q.setStockQuantity(product.getStockQuantity());
        q.setDescription(product.getDescription());
        q.setImageURL(product.getImageURL());
        q.setStatus(product.getStatus());
        q.setLastUpdateBy(product.getLastUpdatedBy());
        try {

            productDAO.updateProduct(q);
            if (product.getStockQuantity() < 5) {
                List<User> users = userDAO.findByRoleId(4);

                for (User user : users) {
                    Notifications noti = new Notifications();
                    noti.setUserId(user.getUserId());
                    noti.setTitle("Cảnh báo số lượng thấp");
                    noti.setContent("Sản phẩm '" + product.getProductName() + "' chỉ còn " + product.getStockQuantity() + " trong kho.");
                    noti.setCreatedAt(new Timestamp(System.currentTimeMillis()));
                    notificationDAO.save(noti);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to update product: " + e.getMessage(), e);
        }

        return convertToDTO(q);
    }


    @Override
    public boolean deleteProduct(int id) {
        Products product = productDAO.getProductById(id);
        if (product == null) {
            throw new RuntimeException("Không tìm thấy sản phẩm");
        }
        product.setStatus(1);
        productDAO.updateProduct(product);
        return true;
    }

    @Override
    public int countProduct() {
        return productDAO.countProduct();
    }

    // Thêm logic nhập sản phẩm mới về kho
    @Override
    public ProductDTO importProduct(ProductDTO productDTO) {
        Products q = new Products();
        q.setProductName(productDTO.getProductName());
        q.setCategoryId(productDTO.getCategoryId());
        q.setSupplierId(productDTO.getSupplierId());
        q.setPrice(productDTO.getPrice());
        q.setStockQuantity(productDTO.getStockQuantity());
        q.setDescription(productDTO.getDescription());
        q.setImageURL(productDTO.getImageURL());
        q.setLastUpdateBy(1); // Giả sử Importer có UserID = 1, cần điều chỉnh
        q.setStatus(productDTO.getStatus());
        q.setCreatedAt(new Timestamp(System.currentTimeMillis())); // Sử dụng Timestamp thay cho Date
        productDAO.addProduct(q);

        // Đảm bảo ProductDetails được lưu với dữ liệu từ ProductDTO
        ProductDetails details = new ProductDetails();
        details.setProductId(q.getProductId());
        details.setHarvestDate(productDTO.getHarvestDate());
        details.setExpirationDate(productDTO.getExpirationDate());
        details.setNutritionalInfo(productDTO.getNutritionalInfo());
        details.setStatus(productDTO.getStatus());
        productDAO.addProductDetails(details);

        // Lấy lại product và details để trả về dữ liệu đầy đủ
        Products updatedProduct = productDAO.getProductById(q.getProductId());
        ProductDetails updatedDetails = productDAO.getProductDetailsById(q.getProductId());
        return convertToDTO(updatedProduct, updatedDetails);
    }

    // Thêm logic cập nhật trạng thái hữu cơ
    @Override
    public ProductDTO updateOrganicStatus(int productId, int organicStatusId) {
        Products product = productDAO.getProductById(productId);
        if (product == null) {
            throw new RuntimeException("Không tìm thấy sản phẩm");
        }
        productDAO.updateProductOrganicInfo(productId, organicStatusId); // Giả sử DAO có phương thức này
        product = productDAO.getProductById(productId); // Lấy lại để cập nhật DTO
        return convertToDTO(product);
    }

    // Thay đổi convertToDTO để bao gồm dữ liệu từ ProductDetails
    private ProductDTO convertToDTO(Products product) {
        return convertToDTO(product, null);
    }

    private ProductDTO convertToDTO(Products product, ProductDetails details) {
        ProductDTO dto = new ProductDTO(
                product.getProductId(),
                product.getProductName(),
                product.getCategoryId(),
                product.getSupplierId(),
                product.getPrice(),
                product.getDiscountPercent(),
                product.getPriceAfterDiscount(),
                product.getStockQuantity(),
                product.getDescription(),
                product.getImageURL(),
                product.getLastUpdatedBy(),
                product.getCreatedAt(),
                product.getStatus()
        );
        if (details != null) {
            dto.setHarvestDate(details.getHarvestDate());
            dto.setExpirationDate(details.getExpirationDate());
            dto.setNutritionalInfo(details.getNutritionalInfo());
        }
        List<ProductImages> imgEntities =
                productImageDAO.getImagesByProductId(product.getProductId());

        List<String> urls = imgEntities.stream()
                .filter(i -> i.getStatus() == 0)
                .map(ProductImages::getImageUrl)
                .collect(Collectors.toList());

        dto.setGalleryImages(urls);
        return dto;
    }

    @Override
    public List<ProductDTO> getAllProductByStatus(int status) {
        List<Products> productList = productDAO.getProductByStatus(status);
        if (productList == null || productList.isEmpty()) {
            throw new RuntimeException("Không tìm thấy sản phẩm có status = " + status);
        }

        List<ProductDTO> list = new ArrayList<>();
        for (Products product : productList) {
            list.add(convertToDTO(product));
        }
        return list;
    }

    @Override
    public List<ProductDTO> getTopDiscountProducts(int limit) {
        List<Products> topDiscountProducts = productDAO.getTopDiscountProducts(limit);
        if (topDiscountProducts == null || topDiscountProducts.isEmpty()) {
            throw new RuntimeException("Không tìm thấy sản phẩm giảm giá");
        }

        List<ProductDTO> result = new ArrayList<>();
        for (Products product : topDiscountProducts) {
            result.add(convertToDTO(product));
        }
        return result;
    }

    @Override
    public Page<ProductDTO> searchProducts(String keyword,
                                           Integer categoryId,
                                           Integer supplierId,
                                           Integer minDiscount,
                                           Pageable pageable) {

        Page<Products> page = productDAO.searchProducts(
                keyword.trim().toLowerCase(),
                categoryId,
                supplierId,
                minDiscount,
                pageable);

        return page.map(p -> mapper.map(p, ProductDTO.class));
    }

    @Override
    public List<ProductDTO> getProductsByCategory(int categoryId) {
        List<Products> productEntities = productDAO.getProductsByCategory(categoryId);
        return productEntities.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

}