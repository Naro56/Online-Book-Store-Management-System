package com.bookstore.service;

import com.bookstore.dto.BookDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookService {
    List<BookDTO> getAllBooks();
    
    Page<BookDTO> getAllBooks(Pageable pageable);
    
    BookDTO getBookById(Long id);
    
    BookDTO createBook(BookDTO bookDTO);
    
    BookDTO updateBook(Long id, BookDTO bookDTO);
    
    void deleteBook(Long id);
    
    Page<BookDTO> searchBooks(String query, Pageable pageable);
    
    Page<BookDTO> getBooksByCategory(Long categoryId, Pageable pageable);
    
    List<BookDTO> getRecentBooks();
} 