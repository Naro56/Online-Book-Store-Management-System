package com.bookstore.dao;

import com.bookstore.model.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryDao {
    List<Category> findAll();
    
    Optional<Category> findById(Long id);
    
    Optional<Category> findByName(String name);
    
    Category save(Category category);
    
    void deleteById(Long id);
    
    boolean existsByName(String name);
} 