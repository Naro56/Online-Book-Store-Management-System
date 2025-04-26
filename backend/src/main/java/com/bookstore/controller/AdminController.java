package com.bookstore.controller;

import com.bookstore.dto.OrderDTO;
import com.bookstore.model.Order;
import com.bookstore.model.OrderStatus;
import com.bookstore.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private OrderRepository orderRepository;

    /**
     * Get all orders with pagination
     * @param page Page number
     * @param size Page size
     * @return Page of orders
     */
    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Order> ordersPage = orderRepository.findAll(pageable);

            List<OrderDTO> orderDTOs = ordersPage.getContent().stream()
                    .map(this::convertToOrderDTO)
                    .collect(Collectors.toList());

            Page<OrderDTO> orderDTOPage = new PageImpl<>(
                    orderDTOs,
                    pageable,
                    ordersPage.getTotalElements()
            );

            return ResponseEntity.ok(orderDTOPage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching orders: " + e.getMessage());
        }
    }

    /**
     * Get order by ID
     * @param id Order ID
     * @return Order data
     */
    @GetMapping("/orders/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            Optional<Order> orderOpt = orderRepository.findById(id);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            OrderDTO orderDTO = convertToOrderDTO(orderOpt.get());
            return ResponseEntity.ok(orderDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching order: " + e.getMessage());
        }
    }

    /**
     * Update order status
     * @param id Order ID
     * @param statusUpdate Status update data
     * @return Updated order
     */
    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> statusUpdate) {
        try {
            Optional<Order> orderOpt = orderRepository.findById(id);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Order order = orderOpt.get();

            // Update status
            String statusStr = (String) statusUpdate.get("status");
            if (statusStr != null && !statusStr.isEmpty()) {
                try {
                    OrderStatus newStatus = OrderStatus.valueOf(statusStr);
                    order.setStatus(newStatus);
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body("Invalid status: " + statusStr);
                }
            }

            // Update tracking number if provided
            Object trackingNumberObj = statusUpdate.get("trackingNumber");
            if (trackingNumberObj != null) {
                String trackingNumber = trackingNumberObj.toString();
                order.setTrackingNumber(trackingNumber);
            }

            // Save updated order
            Order updatedOrder = orderRepository.save(order);
            OrderDTO orderDTO = convertToOrderDTO(updatedOrder);

            return ResponseEntity.ok(orderDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating order status: " + e.getMessage());
        }
    }

    /**
     * Convert Order entity to OrderDTO
     * @param order Order entity
     * @return OrderDTO
     */
    private OrderDTO convertToOrderDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(order.getId());
        orderDTO.setUserId(order.getUser().getId());
        orderDTO.setUsername(order.getUser().getUsername());
        orderDTO.setOrderDate(order.getOrderDate());
        orderDTO.setStatus(order.getStatus());
        orderDTO.setTotalAmount(order.getTotalAmount());
        orderDTO.setShippingAddress(order.getShippingAddress());
        orderDTO.setTrackingNumber(order.getTrackingNumber());

        // Convert order items
        orderDTO.setOrderItems(order.getOrderItems().stream()
                .map(item -> {
                    var itemDTO = new com.bookstore.dto.OrderItemDTO();
                    itemDTO.setId(item.getId());
                    itemDTO.setBookId(item.getBook().getId());
                    itemDTO.setBookTitle(item.getBook().getTitle());
                    itemDTO.setQuantity(item.getQuantity());
                    itemDTO.setPrice(item.getPrice());
                    itemDTO.setSubtotal(item.getSubtotal());
                    return itemDTO;
                })
                .collect(Collectors.toSet()));

        return orderDTO;
    }
}
