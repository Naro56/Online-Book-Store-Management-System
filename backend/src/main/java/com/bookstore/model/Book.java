package com.bookstore.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    private String author;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank
    private String isbn;

    @NotNull
    @Positive
    private BigDecimal price;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @NotNull
    @Positive
    private Integer stockQuantity;

    private String imageUrl;

    @OneToMany(mappedBy = "book")
    private Set<OrderItem> orderItems = new HashSet<>();
    
    // Constructor with essential fields
    public Book(String title, String author, String description, String isbn, 
                BigDecimal price, Category category, Integer stockQuantity) {
        this.title = title;
        this.author = author;
        this.description = description;
        this.isbn = isbn;
        this.price = price;
        this.category = category;
        this.stockQuantity = stockQuantity;
    }
} 