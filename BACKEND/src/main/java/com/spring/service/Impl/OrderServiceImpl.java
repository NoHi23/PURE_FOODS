package com.spring.service.Impl;

import com.spring.dao.OrderDAO;
import com.spring.dao.ProductDAO;
import com.spring.dto.BestSellingProductDTO;
import com.spring.dto.OrderDTO;
import com.spring.entity.Order;
import com.spring.entity.Products;
import com.spring.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional(propagation = Propagation.REQUIRED)
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderDAO orderDAO;

    @Override
    public OrderDTO createOrder(OrderDTO orderDTO) {
        Order order = new Order();
        order.setCustomerID(orderDTO.getCustomerID());
        order.setOrderDate(new Date());
        order.setTotalAmount(orderDTO.getTotalAmount());
        order.setStatusID(orderDTO.getStatusID());
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setShippingMethodID(orderDTO.getShippingMethodID());
        order.setShippingCost(orderDTO.getShippingCost());
        order.setDistance(orderDTO.getDistance());
        order.setDiscountAmount(orderDTO.getDiscountAmount());
        order.setStatus("adsfsd");
        order.setEstimatedDeliveryDate(orderDTO.getEstimatedDeliveryDate());
        order.setDriverID(orderDTO.getDriverID());
        order.setPaymentMethod(orderDTO.getPaymentMethod());

        if ("COD".equalsIgnoreCase(orderDTO.getPaymentMethod())) {
            order.setPaymentStatus("Pending");
        } else {
            order.setPaymentStatus("Unpaid");
        }

        orderDAO.saveOrder(order);
        return convertToDTO(order);
    }

    @Override
    public OrderDTO confirmOrder(OrderDTO orderDTO) {
        Order order = orderDAO.getOrderById(orderDTO.getOrderID());
        if (order == null) {
            throw new IllegalArgumentException("Order not found!");
        }
        order.setStatus("sđ");
        order.setStatusID(2); // ví dụ: 2 = Đã xác nhận
        orderDAO.updateOrder(order);
        return convertToDTO(order);
    }

    @Override
    public void deleteOrder(int orderId) {
        Order order = orderDAO.getOrderById(orderId);
        if (order == null) {
            throw new IllegalArgumentException("Order not found!");
        }
        orderDAO.deleteOrder(orderId);
    }

    @Override
    public OrderDTO getOrderById(int orderId) {
        Order order = orderDAO.getOrderById(orderId);
        if (order == null) {
            throw new IllegalArgumentException("Order not found!");
        }
        return convertToDTO(order);
    }

    @Override
    public List<OrderDTO> getOrdersByCustomerId(int customerId) {
        List<Order> orders = orderDAO.getOrdersByCustomerId(customerId);
        List<OrderDTO> dtoList = new ArrayList<>();
        for (Order order : orders) {
            dtoList.add(convertToDTO(order));
        }
        return dtoList;
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderDAO.getAllOrders();
        List<OrderDTO> dtoList = new ArrayList<>();
        for (Order order : orders) {
            dtoList.add(convertToDTO(order));
        }
        return dtoList;
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderID(order.getOrderID());
        dto.setCustomerID(order.getCustomerID());
        dto.setOrderDate(order.getOrderDate());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatusID(order.getStatusID());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setShippingMethodID(order.getShippingMethodID());
        dto.setShippingCost(order.getShippingCost());
        dto.setDistance(order.getDistance());
        dto.setDiscountAmount(order.getDiscountAmount());
        dto.setStatus(order.getStatus());
        dto.setCancelReason(order.getCancelReason());
        dto.setEstimatedDeliveryDate(order.getEstimatedDeliveryDate());
        dto.setDelayReason(order.getDelayReason());
        dto.setDriverID(order.getDriverID());
        dto.setReturnReason(order.getReturnReason());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());
        return dto;
    }

    @Override
    public int countOrder() {
        return orderDAO.countOrder();
    }

    @Override
    public double calculateTotalRevenue() {
        List<Order> completedOrders = orderDAO.getOrdersByStatusID(4); // statusID = 4 là 'Đã hoàn thành'
        double totalRevenue = 0;
        for (Order order : completedOrders) {
            totalRevenue += order.getTotalAmount();
        }
        return totalRevenue;
    }

    @Override
    public Map<Integer, Double> calculateMonthlyRevenue() {
        List<Order> completedOrders = orderDAO.getOrdersByStatusID(4); // chỉ lấy đơn đã hoàn thành
        Map<Integer, Double> monthlyRevenue = new HashMap<>();

        for (Order order : completedOrders) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(order.getOrderDate());

            int month = calendar.get(Calendar.MONTH) + 1; // Tháng từ 0-11 => +1

            monthlyRevenue.put(month,
                    monthlyRevenue.getOrDefault(month, 0.0) + order.getTotalAmount());
        }

        return monthlyRevenue;
    }

    @Override
    public List<BestSellingProductDTO> getTop5BestSellingProductsWithStats() {
        return orderDAO.getTop5BestSellingProductsWithStats();
    }

    @Override
    public List<Order> getTop5RecentOrders() {
        return orderDAO.getTop5RecentOrders();
    }
}
