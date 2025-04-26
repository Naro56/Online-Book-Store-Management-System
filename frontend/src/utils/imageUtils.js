/**
 * Utility functions for handling book images
 */

// Cache for preloaded images
const imageCache = {};

/**
 * Get a book cover image URL from Google Books API
 * @param {string} isbn - ISBN of the book
 * @param {string} title - Title of the book (fallback if ISBN doesn't work)
 * @returns {string} URL of the book cover image
 */
export const getBookCoverUrl = (isbn, title = '') => {
  if (!isbn && !title) return null;

  // Clean ISBN (remove hyphens, spaces, etc.)
  const cleanIsbn = isbn ? isbn.replace(/[^0-9X]/gi, '') : '';

  // Use Google Books API which provides higher quality images
  if (cleanIsbn) {
    return `https://books.google.com/books/content?id=${cleanIsbn}&printsec=frontcover&img=1&zoom=1&source=gbs_api`;
  } else if (title) {
    // If no ISBN, try to search by title
    const encodedTitle = encodeURIComponent(title);
    return `https://books.google.com/books/content?id=${encodedTitle}&printsec=frontcover&img=1&zoom=1&source=gbs_api`;
  }

  return null;
};

/**
 * Get a fallback image URL for a book
 * @param {string} title - Title of the book
 * @param {string} author - Author of the book
 * @returns {string} URL of a placeholder image with title and author
 */
export const getFallbackImageUrl = (title, author) => {
  // Create a more visually appealing placeholder with better contrast
  const text = encodeURIComponent(`${title || 'Unknown Title'}\n${author ? `by ${author}` : ''}`);
  return `https://via.placeholder.com/400x600/3949ab/ffffff?text=${text}`;
};

/**
 * Preload an image to prevent flickering
 * @param {string} url - URL of the image to preload
 * @returns {Promise} Promise that resolves when the image is loaded
 */
export const preloadImage = (url) => {
  if (!url) return Promise.resolve(false);

  // If already in cache, return immediately
  if (imageCache[url]) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      imageCache[url] = true;
      resolve(true);
    };
    img.onerror = () => {
      resolve(false);
    };
    img.src = url;
  });
};

/**
 * Get a book cover image URL with fallback
 * @param {Object} book - Book object
 * @returns {string} URL of the book cover image
 */
export const getBookImageUrl = (book) => {
  if (!book) return getFallbackImageUrl('Book Not Found', '');

  // If book has a valid imageUrl, use it
  if (book.imageUrl &&
      typeof book.imageUrl === 'string' &&
      !book.imageUrl.includes('placeholder.com') &&
      !book.imageUrl.includes('51QZQZQZQZQ.jpg')) {

    // Check if the URL is relative or absolute
    let imageUrl = book.imageUrl;
    if (imageUrl.startsWith('/')) {
      // Convert relative URL to absolute
      imageUrl = `http://localhost:8080${imageUrl}`;
    }

    // Preload the image in the background
    preloadImage(imageUrl);
    return imageUrl;
  }

  // Try to get image from Google Books API if ISBN is available
  if (book.isbn) {
    const googleBooksUrl = getBookCoverUrl(book.isbn, book.title);
    // Preload the image in the background
    preloadImage(googleBooksUrl);
    return googleBooksUrl;
  }

  // Use fallback image
  const fallbackUrl = getFallbackImageUrl(book.title, book.author);
  preloadImage(fallbackUrl);
  return fallbackUrl;
};
