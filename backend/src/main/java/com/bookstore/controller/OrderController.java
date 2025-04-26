package com.bookstore.controller;

import com.bookstore.dto.OrderDTO;
import com.bookstore.dto.OrderItemDTO;
import com.bookstore.model.Book;
import com.bookstore.model.Order;
import com.bookstore.model.OrderItem;
import com.bookstore.model.User;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.OrderRepository;
import com.bookstore.repository.UserRepository;
import com.bookstore.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    /**
     * Create a new order
     * @param orderDTO Order data
     * @return Created order
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderDTO orderDTO) {
        try {
            // Get current user
            UserDetailsImpl userDetails = getCurrentUserDetails();
            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Create new order
            Order order = new Order();
            order.setUser(user);
            order.setShippingAddress(orderDTO.getShippingAddress());
            order.setTotalAmount(orderDTO.getTotalAmount());

            // Add order items
            for (OrderItemDTO itemDTO : orderDTO.getOrderItems()) {
                Book book = bookRepository.findById(itemDTO.getBookId())
                        .orElseThrow(() -> new RuntimeException("Book not found: " + itemDTO.getBookId()));

                // Check if book is in stock
                if (book.getStockQuantity() < itemDTO.getQuantity()) {
                    return ResponseEntity
                            .badRequest()
                            .body("Not enough stock for book: " + book.getTitle());
                }

                // Create order item
                OrderItem orderItem = new OrderItem();
                orderItem.setBook(book);
                orderItem.setQuantity(itemDTO.getQuantity());
                orderItem.setPrice(book.getPrice());
                order.addOrderItem(orderItem);

                // Update book stock
                book.setStockQuantity(book.getStockQuantity() - itemDTO.getQuantity());
                bookRepository.save(book);
            }

            // Calculate total amount
            order.calculateTotalAmount();

            // Save order
            Order savedOrder = orderRepository.save(order);

            // Convert to DTO for response
            OrderDTO responseDTO = convertToOrderDTO(savedOrder);
            return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating order: " + e.getMessage());
        }
    }

    /**
     * Get order by ID
     * @param id Order ID
     * @return Order data
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            // Get current user
            UserDetailsImpl userDetails = getCurrentUserDetails();
            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Find order
            Optional<Order> orderOpt = orderRepository.findById(id);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Order order = orderOpt.get();

            // Check if order belongs to user or user is admin
            if (!order.getUser().getId().equals(user.getId()) &&
                !userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            // Convert to DTO for response
            OrderDTO responseDTO = convertToOrderDTO(order);
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving order: " + e.getMessage());
        }
    }

    /**
     * Get current user details
     * @return UserDetailsImpl
     */
    private UserDetailsImpl getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserDetailsImpl) authentication.getPrincipal();
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
                    OrderItemDTO itemDTO = new OrderItemDTO();
                    itemDTO.setId(item.getId());
                    itemDTO.setBookId(item.getBook().getId());
                    itemDTO.setBookTitle(item.getBook().getTitle());
                    itemDTO.setQuantity(item.getQuantity());
                    itemDTO.setPrice(item.getPrice());
                    itemDTO.setSubtotal(item.getSubtotal());
                    return itemDTO;
                })
                .collect(java.util.stream.Collectors.toSet()));

        return orderDTO;
    }
}
