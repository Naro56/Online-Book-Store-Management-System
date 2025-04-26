package com.bookstore.dao;

import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CategoryRepository;
import com.bookstore.repository.OrderRepository;
import com.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * RepositoryFactory - Factory Pattern implementation
 * Creates and provides access to different repositories
 */
@Component
public class RepositoryFactory {
    
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    
    @Autowired
    public RepositoryFactory(
            BookRepository bookRepository, 
            CategoryRepository categoryRepository, 
            OrderRepository orderRepository, 
            UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }
    
    /**
     * Factory method that creates DAOs based on type
     * @param daoType The type of DAO to create
     * @return The requested DAO implementation
     */
    public Object createDao(DaoType daoType) {
        switch (daoType) {
            case BOOK:
                return new BookDaoImpl(bookRepository);
            case CATEGORY:
                return new CategoryDaoImpl(categoryRepository);
            case ORDER:
                return new OrderDaoImpl(orderRepository, userRepository);
            case USER:
                return new UserDaoImpl(userRepository);
            default:
                throw new IllegalArgumentException("Unknown DAO type: " + daoType);
        }
    }
    
    /**
     * Enum defining the types of repositories available
     */
    public enum DaoType {
        BOOK,
        CATEGORY,
        ORDER,
        USER
    }
} 