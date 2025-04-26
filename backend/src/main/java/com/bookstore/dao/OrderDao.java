package com.bookstore.dao;

import com.bookstore.model.Order;
import com.bookstore.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface OrderDao {
    List<Order> findAll();
    
    Optional<Order> findById(Long id);
    
    Order save(Order order);
    
    void deleteById(Long id);
    
    List<Order> findByUserOrderByOrderDateDesc(User user);
    
    Page<Order> findByUser(User user, Pageable pageable);
}
