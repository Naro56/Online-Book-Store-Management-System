import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    isbn: '',
    price: '',
    stock: '',
    publishedDate: '',
    publisher: '',
    pages: '',
    language: 'English',
    categoryId: '',
    imageUrl: '',
    coverType: 'Paperback'
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formErrors, setFormErrors] = useState({});

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

    if (isEditMode) {
      fetchBookData();
    }
  }, [id, isEditMode]);

  const fetchBookData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/admin/books/${id}`);
      const bookData = response.data;
      setFormData({
        title: bookData.title || '',
        author: bookData.author || '',
        description: bookData.description || '',
        isbn: bookData.isbn || '',
        price: bookData.price || '',
        stock: bookData.stock || '',
        publishedDate: bookData.publishedDate ? bookData.publishedDate.split('T')[0] : '',
        publisher: bookData.publisher || '',
        pages: bookData.pages || '',
        language: bookData.language || 'English',
        categoryId: bookData.categoryId || '',
        imageUrl: bookData.imageUrl || '',
        coverType: bookData.coverType || 'Paperback'
      });

      if (bookData.imageUrl) {
        setImagePreview(bookData.imageUrl);
      }
    } catch (err) {
      console.error('Error fetching book data:', err);
      setError('Failed to load book data. Please try again later.');

      // Set demo data for development if in edit mode
      if (isEditMode) {
        const demoBook = {
          id: 1,
          title: 'The Midnight Library',
          author: 'Matt Haig',
          description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
          isbn: '978-0525559474',
          price: 19.99,
          stock: 42,
          publishedDate: '2020-08-13',
          publisher: 'Viking',
          pages: 304,
          language: 'English',
          categoryId: 1,
          imageUrl: 'https://m.media-amazon.com/images/I/81tCtHFtOgL._AC_UF1000,1000_QL80_.jpg',
          coverType: 'Hardcover'
        };

        setFormData({
          title: demoBook.title,
          author: demoBook.author,
          description: demoBook.description,
          isbn: demoBook.isbn,
          price: demoBook.price,
          stock: demoBook.stock,
          publishedDate: demoBook.publishedDate,
          publisher: demoBook.publisher,
          pages: demoBook.pages,
          language: demoBook.language,
          categoryId: demoBook.categoryId,
          imageUrl: demoBook.imageUrl,
          coverType: demoBook.coverType
        });

        setImagePreview(demoBook.imageUrl);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Parse numbers for number fields
    if (['price', 'stock', 'pages'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : (name === 'price' ? parseFloat(value) : parseInt(value, 10))
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // In a real app, you would upload the file to a server
    // For demo purposes, we're just creating a local URL
    const imageUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      imageUrl: file // In reality, this would be a URL from your server
    }));
    setImagePreview(imageUrl);

    if (formErrors.imageUrl) {
      setFormErrors(prev => ({
        ...prev,
        imageUrl: null
      }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.title) errors.title = 'Title is required';
    if (!formData.author) errors.author = 'Author is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.isbn) errors.isbn = 'ISBN is required';
    if (!formData.price) errors.price = 'Price is required';
    if (formData.price <= 0) errors.price = 'Price must be greater than zero';
    if (!formData.stock) errors.stock = 'Stock is required';
    if (formData.stock < 0) errors.stock = 'Stock cannot be negative';
    if (!formData.categoryId) errors.categoryId = 'Category is required';
    if (!isEditMode && !formData.imageUrl) errors.imageUrl = 'Book cover image is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);
    try {
      // In a real app, you would upload the image file first and get a URL
      // For this demo, we'll assume the imageUrl is already a URL (or if in edit mode, keep existing)
      let finalImageUrl = formData.imageUrl;
      if (typeof formData.imageUrl === 'object') {
        // In a real app, this would be an upload operation
        finalImageUrl = imagePreview; // Use the preview URL for demo
      }

      const bookData = {
        ...formData,
        imageUrl: finalImageUrl
      };

      if (isEditMode) {
        await axios.put(`/api/admin/books/${id}`, bookData);
      } else {
        await axios.post('/api/admin/books', bookData);
      }

      navigate('/admin/books');
    } catch (err) {
      console.error('Error saving book:', err);
      setError('Failed to save book. Please check your inputs and try again.');
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && !formData.title) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/admin/books" className="text-primary-600 hover:text-primary-800">
          &larr; Back to Books
        </Link>
        <h1 className="text-2xl font-bold mt-2">
          {isEditMode ? 'Edit Book' : 'Add New Book'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="form-label">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className={`form-input ${formErrors.title ? 'border-red-500' : ''}`}
                  value={formData.title}
                  onChange={handleChange}
                />
                {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
              </div>

              <div>
                <label htmlFor="author" className="form-label">Author <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  className={`form-input ${formErrors.author ? 'border-red-500' : ''}`}
                  value={formData.author}
                  onChange={handleChange}
                />
                {formErrors.author && <p className="text-red-500 text-sm mt-1">{formErrors.author}</p>}
              </div>

              <div>
                <label htmlFor="categoryId" className="form-label">Category <span className="text-red-500">*</span></label>
                <select
                  id="categoryId"
                  name="categoryId"
                  className={`form-select ${formErrors.categoryId ? 'border-red-500' : ''}`}
                  value={formData.categoryId}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formErrors.categoryId && <p className="text-red-500 text-sm mt-1">{formErrors.categoryId}</p>}
              </div>

              <div>
                <label htmlFor="isbn" className="form-label">ISBN <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  className={`form-input ${formErrors.isbn ? 'border-red-500' : ''}`}
                  value={formData.isbn}
                  onChange={handleChange}
                />
                {formErrors.isbn && <p className="text-red-500 text-sm mt-1">{formErrors.isbn}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="form-label">Price (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    min="0"
                    className={`form-input ${formErrors.price ? 'border-red-500' : ''}`}
                    value={formData.price}
                    onChange={handleChange}
                  />
                  {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
                </div>

                <div>
                  <label htmlFor="stock" className="form-label">Stock Quantity <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    min="0"
                    className={`form-input ${formErrors.stock ? 'border-red-500' : ''}`}
                    value={formData.stock}
                    onChange={handleChange}
                  />
                  {formErrors.stock && <p className="text-red-500 text-sm mt-1">{formErrors.stock}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="imageUrl" className="form-label">
                  Book Cover Image {!isEditMode && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="file"
                  id="imageUrl"
                  name="imageUrl"
                  accept="image/*"
                  className={`form-input ${formErrors.imageUrl ? 'border-red-500' : ''}`}
                  onChange={handleImageChange}
                />
                {formErrors.imageUrl && <p className="text-red-500 text-sm mt-1">{formErrors.imageUrl}</p>}
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Book cover preview"
                      className="h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <div>
                <label htmlFor="description" className="form-label">Description <span className="text-red-500">*</span></label>
                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  className={`form-textarea ${formErrors.description ? 'border-red-500' : ''}`}
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
                {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
              </div>

              <div>
                <label htmlFor="publisher" className="form-label">Publisher</label>
                <input
                  type="text"
                  id="publisher"
                  name="publisher"
                  className="form-input"
                  value={formData.publisher}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="publishedDate" className="form-label">Publication Date</label>
                  <input
                    type="date"
                    id="publishedDate"
                    name="publishedDate"
                    className="form-input"
                    value={formData.publishedDate}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="pages" className="form-label">Number of Pages</label>
                  <input
                    type="number"
                    id="pages"
                    name="pages"
                    min="1"
                    className="form-input"
                    value={formData.pages}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="language" className="form-label">Language</label>
                  <select
                    id="language"
                    name="language"
                    className="form-select"
                    value={formData.language}
                    onChange={handleChange}
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Chinese</option>
                    <option>Japanese</option>
                    <option>Russian</option>
                    <option>Arabic</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="coverType" className="form-label">Cover Type</label>
                  <select
                    id="coverType"
                    name="coverType"
                    className="form-select"
                    value={formData.coverType}
                    onChange={handleChange}
                  >
                    <option>Paperback</option>
                    <option>Hardcover</option>
                    <option>E-Book</option>
                    <option>Audiobook</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t flex justify-end space-x-3">
          <Link
            to="/admin/books"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Book'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;