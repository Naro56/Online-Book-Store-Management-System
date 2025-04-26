import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { mockBooks } from '../data/mockData';
import { hardcodedBooks } from '../data/hardcodedBooks';
import { getBookImageUrl, preloadImage } from '../utils/imageUtils';
import { booksAPI, categoriesAPI } from '../services/api';

const BookList = () => {
  const { addToCart } = useCart();
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [loading, setLoading] = useState(true);
  // We don't use error state anymore to avoid showing error messages
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Fallback to empty categories
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Initialize with hardcoded data only if API fails
  useEffect(() => {
    // We'll load the initial data in the fetchBooks function
    // This useEffect is just for logging purposes
    console.log('Hardcoded books available as fallback:', hardcodedBooks.length);
  }, []);

  // Fetch books based on filters
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      // We don't set error state anymore

      try {
        let response;

        if (searchTerm) {
          // Search by query
          response = await booksAPI.search(searchTerm, page, 12);
          console.log('Searching for books with term:', searchTerm);
        } else if (selectedCategory && selectedCategory !== '') {
          // Filter by category
          console.log('Filtering books by category ID:', selectedCategory);
          try {
            response = await booksAPI.getByCategory(selectedCategory, page, 12);
          } catch (categoryErr) {
            console.error('Error with category filter, falling back to all books:', categoryErr);
            // If category filter fails, fall back to getting all books
            response = await booksAPI.getAll(page, 12);
          }
        } else {
          // Get all books
          console.log('Getting all books');
          response = await booksAPI.getAll(page, 12);
        }

        // Handle different response formats
        let content = [];
        let totalPages = 1;
        let totalElements = 0;

        // Check if the response has a Spring Data Page format
        if (response.data && response.data.content) {
          content = response.data.content;
          totalPages = response.data.totalPages || 1;
          totalElements = response.data.totalElements || content.length;
        }
        // Check if the response is a direct array
        else if (Array.isArray(response.data)) {
          content = response.data;
          totalElements = content.length;
        }
        // Otherwise, just use the data as is
        else {
          content = [response.data];
          totalElements = 1;
        }

        console.log('API Response:', response.data);
        console.log('Processed content:', content);

        // Handle the data even if it's empty (valid response with no books)
        // Apply price filter client-side
        let filteredBooks = [...content];
        if (priceRange !== 'all') {
          const [min, max] = priceRange.split('-').map(Number);
          filteredBooks = filteredBooks.filter(book => {
            const price = parseFloat(book.price);
            if (max) {
              return price >= min && price <= max;
            }
            return price >= min;
          });
        }

        setBooks(filteredBooks);
        setAllBooks(content);
        setTotalPages(totalPages);
        setTotalElements(totalElements);

        // If we got an empty result from the API, log it but don't throw an error
        if (content.length === 0) {
          console.log('API returned zero books for the current filters');
        }
      } catch (err) {
        // Silently handle errors - just log to console
        console.error('Error fetching books:', err);

        // Fallback to hardcoded data
        console.log('Falling back to hardcoded data');

        // Filter hardcoded books based on current filters
        let filteredBooks = [...hardcodedBooks];

        // Apply category filter if selected
        if (selectedCategory && selectedCategory !== '') {
          console.log('Filtering hardcoded books by category ID:', selectedCategory);

          // Map category IDs to genre names for hardcoded books
          const categoryMap = {
            '1': 'Fiction',
            '2': 'Non-Fiction',
            '3': 'Science Fiction',
            '4': 'Mystery',
            '5': 'Biography',
            '6': 'History',
            '7': 'Self-Help',
            '8': 'Poetry',
            '9': 'Mythology',
            '10': 'Philosophy',
            '11': 'Classic Literature',
            '12': 'Historical Fiction'
          };

          const selectedGenre = categoryMap[selectedCategory];
          console.log('Selected genre from category ID:', selectedGenre);

          if (selectedGenre) {
            filteredBooks = filteredBooks.filter(book => {
              // Check if book has categoryId that matches selectedCategory
              if (book.categoryId && book.categoryId.toString() === selectedCategory.toString()) {
                return true;
              }

              // Check if book genre matches the mapped category
              if (book.genre && book.genre === selectedGenre) {
                return true;
              }

              // Check if book categoryName matches the mapped category
              if (book.categoryName && book.categoryName === selectedGenre) {
                return true;
              }

              return false;
            });
          } else {
            // If no mapping found, try direct comparison with genre
            filteredBooks = filteredBooks.filter(book => {
              return book.categoryId?.toString() === selectedCategory.toString() ||
                     book.genre?.toLowerCase() === selectedCategory.toLowerCase() ||
                     book.categoryName?.toLowerCase() === selectedCategory.toLowerCase();
            });
          }
        }

        // Apply search filter if provided
        if (searchTerm) {
          console.log('Filtering hardcoded books by search term:', searchTerm);
          const term = searchTerm.toLowerCase();
          filteredBooks = filteredBooks.filter(book =>
            book.title?.toLowerCase().includes(term) ||
            book.author?.toLowerCase().includes(term) ||
            book.description?.toLowerCase().includes(term)
          );
        }

        // Apply price filter
        if (priceRange !== 'all') {
          console.log('Filtering hardcoded books by price range:', priceRange);
          const [min, max] = priceRange.split('-').map(Number);
          filteredBooks = filteredBooks.filter(book => {
            const price = parseFloat(book.price);
            if (max) {
              return price >= min && price <= max;
            }
            return price >= min;
          });
        }

        console.log('Filtered hardcoded books:', filteredBooks.length);
        setBooks(filteredBooks);
        setAllBooks(hardcodedBooks);
        setTotalPages(1);
        setTotalElements(filteredBooks.length);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchTerm, selectedCategory, priceRange, page]);

  const handleAddToCart = (book) => {
    addToCart(book);
  };

  const clearFilters = () => {
    console.log('Clearing all filters');
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange('all');
    setSelectedLanguage('');
    setPage(0);

    // Force a refresh of the books list
    console.log('Resetting to show all books');
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center animate-fadeIn">Our Books Collection</h1>

      {/* Search and Filters */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md animate-slideIn" style={{ animationDelay: '0.1s' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Bar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by title or author"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                // Reset page when searching
                setPage(0);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                console.log('Category selected:', e.target.value);
                setSelectedCategory(e.target.value);
                // Reset page when changing category
                setPage(0);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.length > 0 ? (
                categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              ) : (
                // Fallback categories if API fails - must match the categoryMap above
                [
                  { id: 1, name: 'Fiction' },
                  { id: 2, name: 'Non-Fiction' },
                  { id: 3, name: 'Science Fiction' },
                  { id: 4, name: 'Mystery' },
                  { id: 5, name: 'Biography' },
                  { id: 6, name: 'History' },
                  { id: 7, name: 'Self-Help' },
                  { id: 8, name: 'Poetry' },
                  { id: 9, name: 'Mythology' },
                  { id: 10, name: 'Philosophy' },
                  { id: 11, name: 'Classic Literature' },
                  { id: 12, name: 'Historical Fiction' }
                ].map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <select
              value={priceRange}
              onChange={(e) => {
                console.log('Price range selected:', e.target.value);
                setPriceRange(e.target.value);
                // Reset page when changing price range
                setPage(0);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Prices</option>
              <option value="0-299">Under ₹300</option>
              <option value="300-499">₹300 - ₹500</option>
              <option value="500-799">₹500 - ₹800</option>
              <option value="800-1000">₹800 and above</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          {loading ? 'Loading books...' :
            `Showing ${books.length} of ${totalElements} books`}
        </p>
        <div className="flex space-x-2">
          <select
            value={selectedLanguage}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              // Filter by language
              const language = e.target.value;
              console.log('Language selected:', language);
              setSelectedLanguage(language);

              if (language) {
                const filtered = allBooks.filter(book =>
                  book.language === language ||
                  // Fallback for books without language property
                  (book.language === undefined && language === 'English')
                );
                setBooks(filtered);
              } else {
                setBooks(allBooks);
              }
            }}
          >
            <option value="">All Languages</option>
            <option value="Hindi">Hindi</option>
            <option value="Bengali">Bengali</option>
            <option value="Tamil">Tamil</option>
            <option value="Malayalam">Malayalam</option>
            <option value="Telugu">Telugu</option>
            <option value="Kannada">Kannada</option>
            <option value="Marathi">Marathi</option>
            <option value="Gujarati">Gujarati</option>
            <option value="Punjabi">Punjabi</option>
            <option value="Assamese">Assamese</option>
            <option value="Odia">Odia</option>
            <option value="English">English</option>
          </select>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error Message - Hidden */}

      {/* Books Grid */}
      {!loading && (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          {books.map((book, index) => (
          <div key={book.id} className="book-card animate-fadeIn bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: `${0.1 * (index % 8)}s` }}>
            <Link to={`/books/${book.id}`} className="block">
              <div className="h-48 bg-gray-100 flex items-center justify-center rounded-t-lg overflow-hidden">
                <img
                  src={getBookImageUrl(book)}
                  alt={book.title}
                  className="h-full w-full object-contain hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/300x400/3949ab/ffffff?text=${encodeURIComponent(book.title)}\nby ${encodeURIComponent(book.author)}`;
                  }}
                />
              </div>
              <div className="p-3">
                <h3 className="text-md font-semibold mb-1 truncate">{book.title}</h3>
                <p className="text-gray-600 text-xs mb-1 truncate">by {book.author}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-600 font-semibold">₹{typeof book.price === 'number' ? book.price.toFixed(2) : parseFloat(book.price).toFixed(2)}</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-gray-600 text-xs">{book.rating || '4.0'}</span>
                  </div>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                  <span className="px-2 py-1 bg-blue-50 rounded-full">{book.language || 'English'}</span>
                  <span className="px-2 py-1 bg-gray-50 rounded-full">{book.genre || book.categoryName || 'Fiction'}</span>
                </div>
              </div>
            </Link>
            <div className="p-3 border-t">
              <button
                onClick={() => handleAddToCart(book)}
                className="w-full bg-blue-600 text-white py-1.5 text-sm rounded-md hover:bg-blue-700 transition-colors duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
          ))}
        </div>
        </>
      )}

      {/* No Results Message */}
      {!loading && books.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No books found matching your criteria</h3>
          <p className="text-gray-600 mb-6">Try adjusting your filters or browse our popular books below.</p>
          <button
            onClick={clearFilters}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Clear All Filters
          </button>

          {/* Show popular books when no results are found */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-left">Popular Books You Might Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {allBooks
                .slice(0, 8)
                .map((book, index) => (
                  <div key={book.id} className="book-card animate-fadeIn bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: `${0.1 * (index % 8)}s` }}>
                    <Link to={`/books/${book.id}`} className="block">
                      <div className="h-48 bg-gray-100 flex items-center justify-center rounded-t-lg overflow-hidden">
                        <img
                          src={getBookImageUrl(book)}
                          alt={book.title}
                          className="h-full w-full object-contain hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://via.placeholder.com/300x400/3949ab/ffffff?text=${encodeURIComponent(book.title)}\nby ${encodeURIComponent(book.author)}`;
                          }}
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="text-md font-semibold mb-1 truncate">{book.title}</h3>
                        <p className="text-gray-600 text-xs mb-1 truncate">by {book.author}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-blue-600 font-semibold">₹{typeof book.price === 'number' ? book.price.toFixed(2) : parseFloat(book.price).toFixed(2)}</span>
                          <div className="flex items-center">
                            <span className="text-yellow-400 mr-1">★</span>
                            <span className="text-gray-600 text-xs">{book.rating || '4.0'}</span>
                          </div>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                          <span className="px-2 py-1 bg-blue-50 rounded-full">{book.language || 'English'}</span>
                          <span className="px-2 py-1 bg-gray-50 rounded-full">{book.genre || book.categoryName || 'Fiction'}</span>
                        </div>
                      </div>
                    </Link>
                    <div className="p-3 border-t">
                      <button
                        onClick={() => handleAddToCart(book)}
                        className="w-full bg-blue-600 text-white py-1.5 text-sm rounded-md hover:bg-blue-700 transition-colors duration-300"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => handlePageChange(Math.max(0, page - 1))}
              disabled={page === 0}
              className={`px-4 py-2 rounded-l-md border ${page === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Previous
            </button>
            {[...Array(totalPages).keys()].map(pageNum => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-2 border-t border-b ${page === pageNum ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                {pageNum + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className={`px-4 py-2 rounded-r-md border ${page === totalPages - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default BookList;