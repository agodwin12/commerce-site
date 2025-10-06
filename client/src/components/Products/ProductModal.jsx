import React, { useState, useEffect } from 'react';
import { X, Upload, Star } from 'lucide-react';
import { api } from '../../utils/api';
import { ENDPOINTS } from '../../utils/constants';

const ProductModal = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        stock_quantity: '',
        category_id: '',
        is_featured: false,
        rating: '',
        total_reviews: ''
    });
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
        if (product) {
            setFormData({
                name: product.name || '',
                price: product.price || '',
                description: product.description || '',
                stock_quantity: product.stock_quantity || '',
                category_id: product.category_id || '',
                is_featured: product.is_featured || false,
                rating: product.rating || '',
                total_reviews: product.total_reviews || ''
            });

            if (product.images && product.images.length > 0) {
                const existingUrls = product.images.map(img => `http://185.98.136.21:3001${img.image_url}`);
                setPreviewUrls(existingUrls);
            }
        }
    }, [product]);

    const fetchCategories = async () => {
        try {
            const response = await api.get(ENDPOINTS.CATEGORIES);
            if (response.success && response.data) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            setError('You can only upload up to 5 images');
            return;
        }

        setImages(files);
        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
        setImages(newImages);
        setPreviewUrls(newPreviewUrls);
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Product name is required');
            return false;
        }
        if (!formData.price || formData.price <= 0) {
            setError('Please enter a valid price');
            return false;
        }
        if (formData.stock_quantity === '' || formData.stock_quantity < 0) {
            setError('Please enter a valid stock quantity');
            return false;
        }
        if (!formData.category_id) {
            setError('Please select a category');
            return false;
        }
        if (formData.rating && (formData.rating < 0 || formData.rating > 5)) {
            setError('Rating must be between 0 and 5');
            return false;
        }
        if (formData.total_reviews && formData.total_reviews < 0) {
            setError('Total reviews cannot be negative');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            // Prepare data for submission
            const submitData = {
                ...formData,
                rating: formData.rating ? parseFloat(formData.rating) : 0,
                total_reviews: formData.total_reviews ? parseInt(formData.total_reviews) : 0
            };

            let productId;

            if (product) {
                console.log('Updating product:', product.id);
                const response = await api.put(ENDPOINTS.PRODUCT_BY_ID(product.id), submitData);
                productId = product.id;
                console.log('Product updated successfully');
            } else {
                console.log('Creating new product with data:', submitData);
                const response = await api.post(ENDPOINTS.PRODUCTS, submitData);

                if (response.success && response.data) {
                    productId = response.data.id;
                    console.log('Product created successfully with ID:', productId);
                } else {
                    throw new Error('Failed to create product - no product ID returned');
                }
            }

            // Upload images if any
            if (images.length > 0 && productId) {
                console.log(`Uploading ${images.length} images for product ${productId}...`);

                for (let i = 0; i < images.length; i++) {
                    const imageFormData = new FormData();
                    imageFormData.append('image', images[i]);

                    if (i === 0) {
                        imageFormData.append('is_primary', 'true');
                    }

                    console.log(`Uploading image ${i + 1}/${images.length}...`);

                    try {
                        const imageResponse = await fetch(`http://185.98.136.21:3001/api/products/${productId}/images`, {
                            method: 'POST',
                            body: imageFormData
                        });

                        const imageResult = await imageResponse.json();

                        if (!imageResult.success) {
                            console.error('Failed to upload image:', imageResult.message);
                            setError(`Failed to upload image ${i + 1}: ${imageResult.message}`);
                        } else {
                            console.log(`Image ${i + 1} uploaded successfully`);
                        }
                    } catch (uploadError) {
                        console.error('Error uploading image:', uploadError);
                        setError(`Error uploading image ${i + 1}: ${uploadError.message}`);
                    }
                }

                console.log('All images uploaded');
            }

            onSave();
        } catch (error) {
            console.error('Error saving product:', error);
            setError(error.message || 'Failed to save product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Product Name *</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter product name"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">Price ($) *</label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="stock_quantity">Stock Quantity *</label>
                            <input
                                id="stock_quantity"
                                name="stock_quantity"
                                type="number"
                                value={formData.stock_quantity}
                                onChange={handleChange}
                                placeholder="0"
                                disabled={loading}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category_id">Category *</label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter product description..."
                            rows="4"
                            disabled={loading}
                        />
                    </div>

                    {/* Rating and Reviews Section */}
                    <div className="form-section">
                        <h3>Rating & Reviews</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="rating">
                                    <Star size={16} style={{ display: 'inline', marginRight: '5px' }} />
                                    Rating (0-5)
                                </label>
                                <input
                                    id="rating"
                                    name="rating"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    value={formData.rating}
                                    onChange={handleChange}
                                    placeholder="0.0"
                                    disabled={loading}
                                />
                                <small className="form-hint">Average product rating out of 5</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="total_reviews">Total Reviews</label>
                                <input
                                    id="total_reviews"
                                    name="total_reviews"
                                    type="number"
                                    min="0"
                                    value={formData.total_reviews}
                                    onChange={handleChange}
                                    placeholder="0"
                                    disabled={loading}
                                />
                                <small className="form-hint">Number of customer reviews</small>
                            </div>
                        </div>
                    </div>

                    {/* Featured Product Checkbox */}
                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="is_featured"
                                checked={formData.is_featured}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <span className="checkbox-text">
                                <strong>Featured Product</strong>
                                <small>Display this product prominently on the homepage</small>
                            </span>
                        </label>
                    </div>

                    {/* Product Images */}
                    <div className="form-group">
                        <label>Product Images (Max 5)</label>
                        <div className="image-upload-container">
                            <input
                                type="file"
                                id="images"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                disabled={loading}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="images" className="upload-label">
                                <Upload size={24} />
                                <span>Click to upload images</span>
                                <small>PNG, JPG, GIF up to 5MB each</small>
                            </label>
                        </div>

                        {previewUrls.length > 0 && (
                            <div className="image-preview-grid">
                                {previewUrls.map((url, index) => (
                                    <div key={index} className="image-preview">
                                        <img src={url} alt={`Preview ${index + 1}`} />
                                        {!product && (
                                            <button
                                                type="button"
                                                className="remove-image"
                                                onClick={() => removeImage(index)}
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                        {index === 0 && (
                                            <div className="primary-badge">Primary</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          padding: 20px;
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal {
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid #FFD700;
        }

        .modal-header h2 {
          color: #1a1a1a;
          font-size: 24px;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          padding: 5px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .close-btn:hover {
          color: #000;
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 20px;
          border-left: 4px solid #c62828;
        }

        .form-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #e0e0e0;
        }

        .form-section h3 {
          margin: 0 0 15px 0;
          font-size: 16px;
          color: #333;
          font-weight: 600;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .form-hint {
          display: block;
          margin-top: 5px;
          color: #666;
          font-size: 12px;
          font-weight: normal;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #eee;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #FFD700;
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
        }

        .form-group input:disabled,
        .form-group select:disabled,
        .form-group textarea:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .checkbox-group {
          background: #fffbf0;
          border: 2px solid #FFD700;
          border-radius: 8px;
          padding: 15px;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          margin: 0;
          font-weight: normal;
        }

        .checkbox-label input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .checkbox-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .checkbox-text strong {
          color: #1a1a1a;
          font-size: 14px;
        }

        .checkbox-text small {
          color: #666;
          font-size: 12px;
        }

        .image-upload-container {
          margin-top: 10px;
        }

        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          border: 2px dashed #ccc;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          background: #fafafa;
        }

        .upload-label:hover {
          border-color: #FFD700;
          background: #fffbf0;
        }

        .upload-label span {
          margin-top: 10px;
          font-weight: 600;
          color: #333;
        }

        .upload-label small {
          margin-top: 5px;
          color: #999;
          font-size: 12px;
        }

        .image-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .image-preview {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #eee;
          aspect-ratio: 1;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-image {
          position: absolute;
          top: 5px;
          right: 5px;
          background: rgba(244, 67, 54, 0.9);
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .remove-image:hover {
          background: #d32f2f;
          transform: scale(1.1);
        }

        .primary-badge {
          position: absolute;
          bottom: 5px;
          left: 5px;
          background: #FFD700;
          color: #000;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          color: #000;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
        }

        .btn-secondary {
          background: #6c757d;
          color: #fff;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #5a6268;
        }

        @media (max-width: 768px) {
          .modal {
            padding: 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }

          .image-preview-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          }
        }
      `}</style>
        </div>
    );
};

export default ProductModal;