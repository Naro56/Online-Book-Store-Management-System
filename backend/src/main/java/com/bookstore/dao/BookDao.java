package com.bookstore.dao;

import com.bookstore.model.Book;
import com.bookstore.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface BookDao {
    List<Book> findAll();
    
    Page<Book> findAll(Pageable pageable);
    
    Optional<Book> findById(Long id);
    
    Book save(Book book);
    
    void deleteById(Long id);
    
    Page<Book> findByTitleContaining(String title, Pageable pageable);
    
    Page<Book> findByAuthorContaining(String author, Pageable pageable);
    
    Page<Book> findByCategory(Category category, Pageable pageable);
    
    Page<Book> searchBooks(String searchTerm, Pageable pageable);
    
    List<Book> findRecentBooks();
    
    boolean existsById(Long id);
} 