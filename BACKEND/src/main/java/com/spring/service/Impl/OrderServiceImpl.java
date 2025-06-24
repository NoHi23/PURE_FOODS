package com.spring.service.Impl;

import com.spring.dao.OrderDAO;
import com.spring.dao.OrderDetailsDAO;
import com.spring.dao.ProductDAO;
import com.spring.dao.SellersDAO;
import com.spring.dto.OrderDTO;
import com.spring.dto.SellerDTO;
import com.spring.entity.OrderDetails;
import com.spring.entity.Orders;
import com.spring.entity.Products;
import com.spring.entity.Sellers;
import com.spring.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderDAO orderDao;

    @Autowired
    private OrderDetailsDAO orderDetailsDao;

    @Autowired
    private ProductDAO productsDao;

    @Autowired
    private SellersDAO sellersDao;

    @Transactional
    @Override
    public Orders createOrder(Orders order, List<OrderDetails> orderDetailsList) {
        Sellers seller = sellersDao.getSellerById(order.getSeller().getUserId());
        if (seller == null) {
            throw new RuntimeException("Seller not found with ID: " + order.getSeller().getUserId());
        }
        Orders savedOrder = orderDao.addOrder(order);
        Double total = 0.0;
        for (OrderDetails detail : orderDetailsList) {
            Products product = productsDao.getProductById(detail.getProduct().getProductId());
            if (product == null) {
                throw new RuntimeException("Product not found with ID: " + detail.getProduct().getProductId());
            }
            if (product.getStockQuantity() < detail.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product ID: " + product.getProductId());
            }
            detail.setOrder(savedOrder);
            detail.setUnitPrice((double) product.getPrice());
            detail.setSubtotal((double) product.getPrice() * detail.getQuantity());

            total += detail.getSubtotal();
            detail.setStatus(1);
            product.setStockQuantity(product.getStockQuantity() - detail.getQuantity());
            productsDao.updateProduct(product);
            orderDetailsDao.addOrderDetail(detail);
        }
        savedOrder.setTotalAmount(total);
        return orderDao.updateOrder(savedOrder);
    }

    @Override
    public List<OrderDTO> getOrdersBySellerId(int sellerId) {
        List<Orders> orders = orderDao.getOrdersBySellerId(sellerId);
        return orders.stream().map(order -> new OrderDTO(
                order.getOrderId(),
                order.getSeller().getUserId(),
                order.getOrderDate(),
                order.getStatus().getStatusName(),
                order.getShippingAddress(),
                order.getTotalAmount()
        )).collect(Collectors.toList());
    }

    @Override
    public List<OrderDetails> getOrderDetailsByOrderId(int orderId) {
        return orderDetailsDao.getOrderDetailsByOrderId(orderId);
    }

    @Transactional
    @Override
    public Orders updateOrderStatus(int orderId, Integer statusId) {
        Orders order = orderDao.getOrderById(orderId);
        if (order == null) {
            throw new RuntimeException("Order not found with ID: " + orderId);
        }
        order.setStatus(statusId);
        return orderDao.updateOrder(order);
    }

    @Override
    public SellerDTO getSellerProfile(int sellerId) {
        Sellers seller = sellersDao.getSellerById(sellerId);
        if (seller == null) {
            throw new RuntimeException("Seller not found with ID: " + sellerId);
        }
        return new SellerDTO(
                seller.getUserId(),
                seller.getFullName(),
                seller.getEmail(),
                seller.getPhone(),
                seller.getAddress()
        );
    }

    @Transactional
    @Override
    public Sellers updateSellerProfile(int sellerId, SellerDTO sellerDetails) {
        Sellers seller = sellersDao.getSellerById(sellerId);
        if (seller == null) {
            throw new RuntimeException("Seller not found with ID: " + sellerId);
        }
        seller.setFullName(sellerDetails.getFullName());
        seller.setEmail(sellerDetails.getEmail());
        seller.setPhone(sellerDetails.getPhone());
        seller.setAddress(sellerDetails.getAddress());
        return sellersDao.updateSeller(seller);
    }
}
