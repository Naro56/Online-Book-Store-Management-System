import React from 'react';
import { Link } from 'react-router-dom';
import { mockBooks } from '../../data/mockData';
import BookCard from './BookCard';

const PopularBooks = ({ limit = 8 }) => {
  // Get top-rated books
  const popularBooks = [...mockBooks]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);

  return (
    <div className="popular-books">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Popular Books</h2>
        <Link to="/books" className="text-blue-600 hover:text-blue-800 flex items-center">
          View All
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {popularBooks.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default PopularBooks;
