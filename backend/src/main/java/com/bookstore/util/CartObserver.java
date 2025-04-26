package com.bookstore.util;

import java.util.Map;

/**
 * Observer interface for the Observer Pattern
 * Used to notify components when a user's cart is updated
 */
public interface CartObserver {
    void update(Long userId, Map<Long, Integer> cart);
} 