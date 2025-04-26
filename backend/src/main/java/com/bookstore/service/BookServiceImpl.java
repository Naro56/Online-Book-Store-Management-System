package com.bookstore.service;

import com.bookstore.dao.BookDao;
import com.bookstore.dto.BookDTO;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.model.Book;
import com.bookstore.model.Category;
import com.bookstore.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private BookDao bookDao;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<BookDTO> getAllBooks() {
        return bookDao.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<BookDTO> getAllBooks(Pageable pageable) {
        return bookDao.findAll(pageable).map(this::convertToDTO);
    }

    @Override
    public BookDTO getBookById(Long id) {
        Book book = bookDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        return convertToDTO(book);
    }

    @Override
    @Transactional
    public BookDTO createBook(BookDTO bookDTO) {
        Book book = convertToEntity(bookDTO);
        Book savedBook = bookDao.save(book);
        return convertToDTO(savedBook);
    }

    @Override
    @Transactional
    public BookDTO updateBook(Long id, BookDTO bookDTO) {
        if (!bookDao.existsById(id)) {
            throw new ResourceNotFoundException("Book not found with id: " + id);
        }
        
        Book book = convertToEntity(bookDTO);
        book.setId(id);
        Book updatedBook = bookDao.save(book);
        return convertToDTO(updatedBook);
    }

    @Override
    @Transactional
    public void deleteBook(Long id) {
        if (!bookDao.existsById(id)) {
            throw new ResourceNotFoundException("Book not found with id: " + id);
        }
        bookDao.deleteById(id);
    }

    @Override
    public Page<BookDTO> searchBooks(String query, Pageable pageable) {
        return bookDao.searchBooks(query, pageable).map(this::convertToDTO);
    }

    @Override
    public Page<BookDTO> getBooksByCategory(Long categoryId, Pageable pageable) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
        return bookDao.findByCategory(category, pageable).map(this::convertToDTO);
    }

    @Override
    public List<BookDTO> getRecentBooks() {
        return bookDao.findRecentBooks().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Helper method to convert Entity to DTO
    private BookDTO convertToDTO(Book book) {
        return BookDTO.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .description(book.getDescription())
                .isbn(book.getIsbn())
                .price(book.getPrice())
                .categoryId(book.getCategory().getId())
                .categoryName(book.getCategory().getName())
                .stockQuantity(book.getStockQuantity())
                .imageUrl(book.getImageUrl())
                .build();
    }

    // Helper method to convert DTO to Entity
    private Book convertToEntity(BookDTO bookDTO) {
        Category category = categoryRepository.findById(bookDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + bookDTO.getCategoryId()));

        Book book = new Book();
        book.setTitle(bookDTO.getTitle());
        book.setAuthor(bookDTO.getAuthor());
        book.setDescription(bookDTO.getDescription());
        book.setIsbn(bookDTO.getIsbn());
        book.setPrice(bookDTO.getPrice());
        book.setCategory(category);
        book.setStockQuantity(bookDTO.getStockQuantity());
        book.setImageUrl(bookDTO.getImageUrl());
        
        return book;
    }
} 