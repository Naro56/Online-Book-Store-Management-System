package com.bookstore.dao;

import com.bookstore.model.Order;
import com.bookstore.model.User;
import com.bookstore.repository.OrderRepository;
import com.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class OrderDaoImpl implements OrderDao {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Autowired
    public OrderDaoImpl(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    @Override
    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }

    @Override
    public Order save(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public void deleteById(Long id) {
        orderRepository.deleteById(id);
    }

    @Override
    public List<Order> findByUserOrderByOrderDateDesc(User user) {
        return orderRepository.findByUserOrderByOrderDateDesc(user);
    }

    @Override
    public Page<Order> findByUser(User user, Pageable pageable) {
        return orderRepository.findByUser(user, pageable);
    }
} 