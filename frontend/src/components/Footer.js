import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white shadow-lg mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">&copy; 2024 BookStore. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link to="/terms" className="text-gray-600 hover:text-gray-900">
              Terms
            </Link>
            <Link to="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 