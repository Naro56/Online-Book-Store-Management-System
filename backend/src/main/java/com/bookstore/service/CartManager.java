package com.bookstore.service;

import com.bookstore.model.Book;
import com.bookstore.util.CartObserver;
import com.bookstore.util.CartSubject;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * CartManager implemented as a Singleton pattern
 * This class manages shopping carts for all users in the system
 * Also implements CartSubject interface for Observer pattern
 */
@Component
public class CartManager implements CartSubject {
    
    // Singleton instance
    private static CartManager instance;
    
    // Thread-safe map of user carts: userId -> Map of (bookId -> quantity)
    private final Map<Long, Map<Long, Integer>> userCarts;
    
    // List of observers
    private final List<CartObserver> observers;
    
    // Private constructor to prevent instantiation
    private CartManager() {
        userCarts = new ConcurrentHashMap<>();
        observers = new ArrayList<>();
    }
    
    // Synchronized method to get the singleton instance
    public static synchronized CartManager getInstance() {
        if (instance == null) {
            instance = new CartManager();
        }
        return instance;
    }
    
    // Observer pattern methods
    @Override
    public void registerObserver(CartObserver observer) {
        if (!observers.contains(observer)) {
            observers.add(observer);
        }
    }

    @Override
    public void removeObserver(CartObserver observer) {
        observers.remove(observer);
    }

    @Override
    public void notifyObservers(Long userId) {
        for (CartObserver observer : observers) {
            observer.update(userId, getCart(userId));
        }
    }
    
    // Add a book to a user's cart
    public void addToCart(Long userId, Long bookId, Integer quantity) {
        userCarts.computeIfAbsent(userId, k -> new HashMap<>());
        Map<Long, Integer> cart = userCarts.get(userId);
        
        cart.compute(bookId, (k, v) -> (v == null) ? quantity : v + quantity);
        
        // Notify observers of the change
        notifyObservers(userId);
    }
    
    // Update book quantity in cart
    public void updateCartItem(Long userId, Long bookId, Integer quantity) {
        if (userCarts.containsKey(userId)) {
            Map<Long, Integer> cart = userCarts.get(userId);
            if (quantity <= 0) {
                cart.remove(bookId);
            } else {
                cart.put(bookId, quantity);
            }
            
            // Notify observers of the change
            notifyObservers(userId);
        }
    }
    
    // Remove a book from a user's cart
    public void removeFromCart(Long userId, Long bookId) {
        if (userCarts.containsKey(userId)) {
            userCarts.get(userId).remove(bookId);
            
            // Notify observers of the change
            notifyObservers(userId);
        }
    }
    
    // Get user's cart
    public Map<Long, Integer> getCart(Long userId) {
        return userCarts.getOrDefault(userId, new HashMap<>());
    }
    
    // Clear user's cart
    public void clearCart(Long userId) {
        userCarts.remove(userId);
        
        // Notify observers of the change
        notifyObservers(userId);
    }
} 