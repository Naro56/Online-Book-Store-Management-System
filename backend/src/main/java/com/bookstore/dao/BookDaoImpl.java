package com.bookstore.dao;

import com.bookstore.model.Book;
import com.bookstore.model.Category;
import com.bookstore.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class BookDaoImpl implements BookDao {

    private final BookRepository bookRepository;

    // Constructor for Autowired injection
    @Autowired
    public BookDaoImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    @Override
    public Page<Book> findAll(Pageable pageable) {
        return bookRepository.findAll(pageable);
    }

    @Override
    public Optional<Book> findById(Long id) {
        return bookRepository.findById(id);
    }

    @Override
    public Book save(Book book) {
        return bookRepository.save(book);
    }

    @Override
    public void deleteById(Long id) {
        bookRepository.deleteById(id);
    }

    @Override
    public Page<Book> findByTitleContaining(String title, Pageable pageable) {
        return bookRepository.findByTitleContainingIgnoreCase(title, pageable);
    }

    @Override
    public Page<Book> findByAuthorContaining(String author, Pageable pageable) {
        return bookRepository.findByAuthorContainingIgnoreCase(author, pageable);
    }

    @Override
    public Page<Book> findByCategory(Category category, Pageable pageable) {
        return bookRepository.findByCategory(category, pageable);
    }

    @Override
    public Page<Book> searchBooks(String searchTerm, Pageable pageable) {
        return bookRepository.searchBooks(searchTerm, pageable);
    }

    @Override
    public List<Book> findRecentBooks() {
        return bookRepository.findTop10ByOrderByIdDesc();
    }

    @Override
    public boolean existsById(Long id) {
        return bookRepository.existsById(id);
    }
} 