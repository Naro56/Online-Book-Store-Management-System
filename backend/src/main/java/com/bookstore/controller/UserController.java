package com.bookstore.controller;

import com.bookstore.dto.OrderDTO;
import com.bookstore.dto.UserDTO;
import com.bookstore.model.Order;
import com.bookstore.model.User;
import com.bookstore.repository.OrderRepository;
import com.bookstore.repository.UserRepository;
import com.bookstore.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    /**
     * Get current user details
     * @return UserDTO with user details
     */
    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDTO> getUserProfile() {
        UserDetailsImpl userDetails = getCurrentUserDetails();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getAddress(),
                user.getPhoneNumber()
        );

        return ResponseEntity.ok(userDTO);
    }

    /**
     * Get orders for the current user
     * @return List of OrderDTO objects
     */
    @GetMapping("/orders")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OrderDTO>> getUserOrders() {
        UserDetailsImpl userDetails = getCurrentUserDetails();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Order> orders = orderRepository.findByUserOrderByOrderDateDesc(user);

        List<OrderDTO> orderDTOs = orders.stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(orderDTOs);
    }

    /**
     * Helper method to get current authenticated user details
     * @return UserDetailsImpl object
     */
    private UserDetailsImpl getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserDetailsImpl) authentication.getPrincipal();
    }

    /**
     * Helper method to convert Order entity to OrderDTO
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
