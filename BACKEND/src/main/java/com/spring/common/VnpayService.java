package com.spring.common;

import com.spring.dao.OrderDAO;
import com.spring.dto.OrderDTO;
import com.spring.entity.Order;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class VnpayService {
    @Autowired
    private OrderDAO orderDAO;

    private final String vnp_TmnCode = "314DHI65";
    private final String vnp_HashSecret = "Z59MOA519L2SOY4THM6PIQX35DNAKRPY";
    private final String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private final String vnp_ReturnUrl = "http://localhost:8082/PureFoods/api/orders/payment-return";

    public String createPaymentUrl(OrderDTO order) throws UnsupportedEncodingException {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_OrderInfo = "Thanh toan don hang: " + order.getOrderID();
        String orderType = "other";
        String vnp_TxnRef = String.valueOf(order.getOrderID());

        String vnp_IpAddr = "127.0.0.1"; // hoặc lấy từ request
        String vnp_TmnCode = "314DHI65";
        String vnp_HashSecret = "Z59MOA519L2SOY4THM6PIQX35DNAKRPY";
        String vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        String vnp_ReturnUrl = "http://localhost:8082/PureFoods/api/orders/payment-return";

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);

        double usdAmount = order.getTotalAmount(); // 60 USD
        double rate = 24000; // Tỷ giá USD → VND

        long vnpAmount = (long)(usdAmount * rate * 100);
        vnp_Params.put("vnp_Amount", String.valueOf(vnpAmount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Date dt = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(dt);
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (String fieldName : fieldNames) {
            String value = vnp_Params.get(fieldName);
            if ((value != null) && (!value.isEmpty())) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(value, StandardCharsets.US_ASCII)).append('&');
                query.append(fieldName).append('=').append(URLEncoder.encode(value, StandardCharsets.US_ASCII)).append('&');
            }
        }

        // Remove last "&"
        hashData.setLength(hashData.length() - 1);
        query.setLength(query.length() - 1);

        String vnp_SecureHash = hmacSHA512(vnp_HashSecret, hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);
        return vnp_Url + "?" + query.toString();
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hash = new StringBuilder();
            for (byte b : bytes) {
                hash.append(String.format("%02x", b));
            }
            return hash.toString();
        } catch (Exception ex) {
            throw new RuntimeException("Error while generating HMAC SHA512", ex);
        }
    }
    @Transactional

    public boolean verifyAndUpdateOrder(String orderIdStr, String responseCode) {
        int orderId;

        try {
            orderId = Integer.parseInt(orderIdStr);
        } catch (NumberFormatException e) {
            return false; // orderId không hợp lệ
        }

        Order order = orderDAO.getOrderById(orderId);
        if (order == null) return false;

        if ("00".equals(responseCode)) {
            order.setPaymentStatus("Paid");
            order.setStatus("Confirmed");
            order.setStatusID(2);
            orderDAO.updateOrder(order);
            return true;
        } else {
            order.setPaymentStatus("Failed");
            order.setStatus("Payment Failed");
            orderDAO.updateOrder(order);
            return false;
        }
    }


}
