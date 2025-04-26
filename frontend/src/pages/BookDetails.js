import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { mockBooks } from '../data/mockData';
import { hardcodedBooks } from '../data/hardcodedBooks';
import StarRating from '../components/books/StarRating';
import { getBookImageUrl, preloadImage } from '../utils/imageUtils';
import { booksAPI } from '../services/api';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // First set from hardcoded data immediately
    const foundBook = hardcodedBooks.find(b => b.id === parseInt(id)) || mockBooks.find(b => b.id === parseInt(id));
    if (foundBook) {
      setBook(foundBook);

      // Preload the book image
      const url = getBookImageUrl(foundBook);
      setImageUrl(url);
      preloadImage(url).then(success => {
        setImageLoaded(success);
      });
    }

    // Then try to load from API
    const loadBookDetails = async () => {
      try {
        // Fetch book details from API
        const response = await booksAPI.getById(id);
        const bookData = response.data;

        // Convert API data to match our frontend model
        const formattedBook = {
          id: bookData.id,
          title: bookData.title,
          author: bookData.author,
          description: bookData.description,
          price: parseFloat(bookData.price),
          isbn: bookData.isbn,
          stock: bookData.stockQuantity,
          rating: 4.5, // Default rating since API might not have this
          language: 'English', // Default language since API might not have this
          genre: bookData.categoryName,
          imageUrl: bookData.imageUrl,
          publisher: 'Publisher', // Default publisher
          publicationDate: '2023', // Default publication date
        };

        setBook(formattedBook);

        // Preload the book image
        const url = getBookImageUrl(formattedBook);
        setImageUrl(url);
        await preloadImage(url).then(success => {
          setImageLoaded(success);
        });
      } catch (error) {
        // Silently handle errors - just log to console
        console.error('Error fetching book details:', error);
        // We already set the mock data above, so no need to do it again
      } finally {
        setLoading(false);
      }
    };

    loadBookDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (book) {
      addToCart({ ...book, quantity });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // If book is not found, we'll just show a loading message
  // This prevents showing error messages to the user
  if (!book) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading book details...</h2>
          <button
            onClick={() => navigate('/books')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
        {/* Book Image */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
          <div className="h-96 bg-gray-100 flex items-center justify-center">
            {!imageLoaded ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <img
                src={imageUrl}
                alt={book.title}
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/600x800/3949ab/ffffff?text=${encodeURIComponent(book.title)}\nby ${encodeURIComponent(book.author)}`;
                  setImageLoaded(true);
                }}
              />
            )}
          </div>
        </div>

        {/* Book Details */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 animate-slideIn" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-2xl ${
                    i < Math.floor(book.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="ml-2 text-gray-600">({book.rating})</span>
          </div>

          <div className="mb-6">
            <p className="text-2xl font-bold text-blue-600 mb-2">₹{typeof book.price === 'number' ? book.price.toFixed(2) : parseFloat(book.price).toFixed(2)}</p>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Language: {book.language || 'English'}</span>
              <span className="text-gray-600">Genre: {book.genre || book.categoryName || 'Fiction'}</span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{book.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Availability</h2>
            <p className="text-gray-700">
              {book.stock > 0 || book.stockQuantity > 0 ? (
                <span className="text-green-600">In Stock ({book.stock || book.stockQuantity} available)</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </p>
          </div>

          {!isAdmin && (
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-3 py-1">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(book.stock || book.stockQuantity, quantity + 1))}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {isAdmin && (
            <div className="mb-6 p-3 bg-gray-100 rounded-md">
              <h2 className="text-lg font-semibold text-gray-800">Admin Information</h2>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-600">ISBN:</p>
                  <p className="font-medium">{book.isbn || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Publisher:</p>
                  <p className="font-medium">{book.publisher || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Publication Date:</p>
                  <p className="font-medium">{book.publicationDate || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stock:</p>
                  <p className="font-medium">{book.stock} units</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4 mt-8 animate-slideUp" style={{ animationDelay: '0.4s' }}>
            {isAdmin ? (
              // Admin actions
              <>
                <Link
                  to={`/admin/books/edit/${book.id}`}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-md hover:bg-gray-800 transition-all duration-300 text-center transform hover:scale-105"
                >
                  Edit Book
                </Link>
                <Link
                  to="/admin/books"
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 transition-all duration-300 text-center transform hover:scale-105"
                >
                  Back to Books
                </Link>
              </>
            ) : (
              // Regular user actions
              <>
                <button
                  onClick={handleAddToCart}
                  disabled={(book.stock || book.stockQuantity) === 0}
                  className={`flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 ${
                    (book.stock === 0 && book.stockQuantity === 0) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
                >
                  Continue Shopping
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;