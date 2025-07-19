package com.spring.common;

import com.spring.dto.OrderDTO;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session; // Sửa lại đúng import cho Stripe Checkout
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeService {
    @Value("${stripe.secret.key}")
    private String secretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public String createStripeCheckoutSession(OrderDTO order) {
        try {
            double amount = order.getTotalAmount() != null ? order.getTotalAmount() : 0.0;

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("http://localhost:3000/payment-success")
                    .setCancelUrl("http://localhost:3000/payment-cancel")
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("usd") // ⚠️ Không được để vnd
                                                    .setUnitAmount((long) (amount * 100)) // cents
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName("Thanh toán đơn hàng #" + order.getOrderID())
                                                                    .build()
                                                    )
                                                    .build()
                                    )
                                    .build()
                    )
                    .build();

            Session session = Session.create(params);
            return session.getUrl();
        } catch (StripeException e) {
            e.printStackTrace(); // để in stack trace
            throw new RuntimeException("Stripe error: " + e.getMessage());
        }
    }
}
