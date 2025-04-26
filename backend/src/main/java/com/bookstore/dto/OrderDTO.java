package com.bookstore.dto;

import com.bookstore.model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;

    @NotNull(message = "User ID is required")
    private Long userId;

    private String username;

    private LocalDateTime orderDate;

    private OrderStatus status;

    private BigDecimal totalAmount;

    private String shippingAddress;

    private String trackingNumber;

    @NotEmpty(message = "Order must contain at least one item")
    private Set<OrderItemDTO> orderItems = new HashSet<>();
}