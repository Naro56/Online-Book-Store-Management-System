import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../../components/Pagination';
import { mockBooks } from '../../data/mockData';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Set demo categories for development
        setCategories([
          { id: 1, name: 'Fiction' },
          { id: 2, name: 'Non-Fiction' },
          { id: 3, name: 'Science Fiction' },
          { id: 4, name: 'Mystery' },
          { id: 5, name: 'Biography' }
        ]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/admin/books', {
          params: {
            page: currentPage,
            search: searchTerm,
            category: selectedCategory,
            sortBy,
            sortOrder
          }
        });
        setBooks(response.data.books);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books. Please try again later.');

        // Set demo data for development
        setDemoData();
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage, searchTerm, selectedCategory, sortBy, sortOrder]);

  // Helper function to set demo data
  const setDemoData = () => {
    // Use the mockBooks from our data file to ensure consistency
    const allDemoBooks = mockBooks.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn || `978-${Math.floor(Math.random() * 10000000000)}`,
      price: book.price,
      stock: book.stock,
      category: book.genre,
      publishedDate: book.publishedDate || '2022-01-01',
      imageUrl: book.imageUrl
    }));

    // Calculate total pages based on 5 books per page
    const booksPerPage = 5;
    const totalBooks = allDemoBooks.length;
    const calculatedTotalPages = Math.ceil(totalBooks / booksPerPage);

    // Get books for current page
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const booksForCurrentPage = allDemoBooks.slice(startIndex, endIndex);

    setBooks(booksForCurrentPage);
    setTotalPages(calculatedTotalPages);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/books/${id}`);
      setBooks(books.filter(book => book.id !== id));
    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Failed to delete book. Please try again later.');
    }
  };

  const renderSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (loading && books.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && books.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl text-red-600">{error}</h2>
        <button
          className="mt-4 btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl font-bold">Book Management</h1>
        <div className="mt-4 md:mt-0">
          <Link to="/admin/books/create" className="btn btn-primary">
            Add New Book
          </Link>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card mb-8">
        <div className="p-4">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                className="form-input w-full"
                placeholder="Search by title, author, or ISBN"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                className="form-select w-full"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn btn-primary w-full">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Book Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center hover:text-gray-700"
                    onClick={() => handleSort('title')}
                  >
                    Book Info {renderSortIcon('title')}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center hover:text-gray-700"
                    onClick={() => handleSort('category')}
                  >
                    Category {renderSortIcon('category')}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center hover:text-gray-700"
                    onClick={() => handleSort('price')}
                  >
                    Price {renderSortIcon('price')}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center hover:text-gray-700"
                    onClick={() => handleSort('stock')}
                  >
                    Stock {renderSortIcon('stock')}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No books found. Try adjusting your search or filters.
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 object-cover rounded" src={book.imageUrl} alt={book.title} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{book.title}</div>
                          <div className="text-sm text-gray-500">{book.author}</div>
                          <div className="text-xs text-gray-400">ISBN: {book.isbn}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{book.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        book.stock > 10
                          ? 'bg-green-100 text-green-800'
                          : book.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {book.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/books/${book.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`btn btn-sm ${currentPage === 1 ? 'btn-disabled' : 'btn-primary'}`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`btn btn-sm ${currentPage === totalPages ? 'btn-disabled' : 'btn-primary'}`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;