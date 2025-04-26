import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import StarRating from './StarRating';
import { getBookImageUrl, preloadImage } from '../../utils/imageUtils';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Format price with 2 decimal places
  const formattedPrice = book.price.toFixed(2);

  // Preload image
  useEffect(() => {
    const url = getBookImageUrl(book);
    setImageUrl(url);

    // Preload the image to prevent flickering
    preloadImage(url).then(success => {
      setImageLoaded(success);
    });
  }, [book]);

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book);
  };

  return (
    <div className="book-card group h-full flex flex-col animate-fadeIn hover-lift">
      <Link to={`/books/${book.id}`} className="flex flex-col h-full">
        {/* Book Image */}
        <div className="relative h-56 bg-gray-100 rounded-t-lg overflow-hidden">
          {!imageLoaded ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://via.placeholder.com/300x400/3949ab/ffffff?text=${encodeURIComponent(book.title)}\nby ${encodeURIComponent(book.author)}`;
                setImageLoaded(true);
              }}
            />
          )}
          {/* Discount Badge - only shown if discount is available */}
          {book.discount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {book.discount}% OFF
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="flex-1 p-4 flex flex-col">
          <h3 className="font-medium text-lg mb-1 line-clamp-2">{book.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{book.author}</p>

          {/* Rating */}
          <div className="mb-2">
            <StarRating rating={book.rating} />
          </div>

          {/* Price */}
          <div className="mt-auto flex justify-between items-center">
            <div>
              {book.originalPrice ? (
                <div className="flex items-center">
                  <span className="text-lg font-bold text-primary-700">₹{formattedPrice}</span>
                  <span className="ml-2 text-sm text-gray-500 line-through">₹{book.originalPrice.toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-lg font-bold text-primary-700">₹{formattedPrice}</span>
              )}
            </div>

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              className="btn-primary p-2 rounded-full transition-colors"
              aria-label="Add to cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;