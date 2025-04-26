package com.bookstore.util;

/**
 * Subject interface for the Observer Pattern
 * Manages observers and notifies them of changes to the cart
 */
public interface CartSubject {
    void registerObserver(CartObserver observer);
    void removeObserver(CartObserver observer);
    void notifyObservers(Long userId);
}
