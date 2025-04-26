package com.bookstore.dao;

import com.bookstore.model.User;

import java.util.List;
import java.util.Optional;

public interface UserDao {
    List<User> findAll();
    
    Optional<User> findById(Long id);
    
    Optional<User> findByUsername(String username);
    
    User save(User user);
    
    void deleteById(Long id);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
} 