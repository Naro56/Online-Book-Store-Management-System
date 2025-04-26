import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import BackgroundImage from '../components/BackgroundImage';
import PopularBooks from '../components/books/PopularBooks';
import { mockBooks } from '../data/mockData';
import { hardcodedBooks } from '../data/hardcodedBooks';
import { getBookImageUrl } from '../utils/imageUtils';

const Home = () => {
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    console.log('Home component: Checking authentication', { currentUser });
    if (!currentUser) {
      console.log('Home component: No authenticated user, redirecting to login');
      navigate('/');
    } else {
      console.log('Home component: User authenticated, staying on home page');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    // Simulating API call to fetch books
    const fetchBooks = async () => {
      setLoading(true);
      try {
        // In a real app, this would be fetched from an API
        setTimeout(() => {
          // Use the hardcoded books
          // Featured books - first 4 books
          setFeaturedBooks(hardcodedBooks.slice(0, 4));

          // New releases - next 3 books
          setNewReleases(hardcodedBooks.slice(4, 7));

          // Best sellers - next 3 books
          setBestSellers(hardcodedBooks.slice(0, 3));

          setLoading(false);
        }, 800);
      } catch (error) {
        // Silently handle errors - just log to console
        console.error('Error fetching books:', error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleAddToCart = (book) => {
    addToCart(book);
    // Show toast notification here
  };

  // Array of book categories with icons and colors
  const categories = [
    { name: 'Fiction', icon: '📚', color: 'bg-blue-100 text-blue-800' },
    { name: 'Fantasy', icon: '🧙', color: 'bg-purple-100 text-purple-800' },
    { name: 'Mystery', icon: '🔍', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Romance', icon: '💖', color: 'bg-pink-100 text-pink-800' },
    { name: 'Science Fiction', icon: '🚀', color: 'bg-indigo-100 text-indigo-800' },
    { name: 'Biography', icon: '👤', color: 'bg-green-100 text-green-800' },
    { name: 'History', icon: '🏛️', color: 'bg-amber-100 text-amber-800' },
    { name: 'Self-Help', icon: '🌱', color: 'bg-teal-100 text-teal-800' }
  ];

  // Function to render star ratings
  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}

        {hasHalfStar && (
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="halfGradient">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#E5E7EB" />
              </linearGradient>
            </defs>
            <path fill="url(#halfGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}

        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Book card component
  const BookCard = ({ book, showDescription = false }) => {
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

    return (
      <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
        <Link to={`/books/${book.id}`} className="block relative pb-[140%]">
          <img
            src={getBookImageUrl(book)}
            alt={book.title}
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://via.placeholder.com/300x450?text=${encodeURIComponent(book.title)}\nby ${encodeURIComponent(book.author)}`;
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-sm">{book.description || `A captivating book by ${book.author}`}</p>
          </div>
        </Link>
        <div className="p-4">
          <Link to={`/books/${book.id}`} className="block">
            <h3 className="text-lg font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">{book.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{book.author}</p>
            <div className="flex items-center mb-2">
              {renderRating(book.rating)}
              <span className="text-xs text-gray-500 ml-1">({book.rating})</span>
            </div>
          </Link>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-blue-600">₹{typeof book.price === 'number' ? book.price.toFixed(2) : parseFloat(book.price).toFixed(2)}</span>
            {isAdmin ? (
              <Link
                to={`/admin/books/edit/${book.id}`}
                className="text-white bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                Edit Book
              </Link>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart(book);
                }}
                className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <BackgroundImage
      imageUrl="https://images.unsplash.com/photo-1519682337058-a94d519337bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
    >
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 animate-fadeIn">
            Welcome to Indian BookStore
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto animate-slideUp">
            Discover the rich literary heritage of India through our collection of books in various Indian languages.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/books"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Books
            </Link>
            {!currentUser && (
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Featured Categories */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Indian Languages</h3>
            <p className="text-gray-600 mb-4">
              Explore books in Hindi, Bengali, Tamil, Telugu, and more Indian languages.
            </p>
            <Link
              to="/books?language=Hindi"
              className="text-blue-600 hover:text-blue-800"
            >
              View Hindi Books →
            </Link>
          </div>

          <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Classic Literature</h3>
            <p className="text-gray-600 mb-4">
              Discover timeless classics from renowned Indian authors.
            </p>
            <Link
              to="/books?genre=Classic"
              className="text-blue-600 hover:text-blue-800"
            >
              View Classics →
            </Link>
          </div>

          <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">New Arrivals</h3>
            <p className="text-gray-600 mb-4">
              Check out our latest additions to the collection.
            </p>
            <Link
              to="/books?sort=newest"
              className="text-blue-600 hover:text-blue-800"
            >
              View New Books →
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Books Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 bg-white bg-opacity-95 rounded-lg shadow-xl my-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Popular Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {featuredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/books" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105">
            View All Books
          </Link>
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg my-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">New Arrivals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {newReleases.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </BackgroundImage>
  );
};

export default Home;