import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { api } from '../../utils/api';
import { ENDPOINTS } from '../../utils/constants';

const CategoryModal = ({ category, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (category) {
            setName(category.name || '');
            setDescription(category.description || '');
            // If category has existing image, show it
            if (category.image_url) {
                setPreviewUrl(`http://localhost:3000${category.image_url}`);
            }
        }
    }, [category]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should not exceed 5MB');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file');
                return;
            }

            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError('');
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreviewUrl('');
    };

    const validateForm = () => {
        if (!name.trim()) {
            setError('Category name is required');
            return false;
        }
        if (name.trim().length < 2) {
            setError('Category name must be at least 2 characters');
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

            // Create FormData for category with image
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('description', description.trim());

            if (image) {
                formData.append('image', image);
            }

            if (category) {
                // Update existing category
                await api.putFormData(`/categories/${category.id}`, formData);
            } else {
                // Create new category
                await api.postFormData(ENDPOINTS.CATEGORIES, formData);
            }

            onSave();
        } catch (error) {
            console.error('Error saving category:', error);
            setError(error.message || 'Failed to save category. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{category ? 'Edit Category' : 'Add New Category'}</h2>
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
                        <label htmlFor="name">Category Name *</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Electronics, Clothing, Books"
                            disabled={loading}
                            required
                            maxLength={50}
                        />
                        <small>{name.length}/50 characters</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description (Optional)</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of this category..."
                            rows="3"
                            disabled={loading}
                            maxLength={200}
                        />
                        <small>{description.length}/200 characters</small>
                    </div>

                    <div className="form-group">
                        <label>Category Image</label>
                        <div className="image-upload-container">
                            <input
                                type="file"
                                id="category-image"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={loading}
                                style={{ display: 'none' }}
                            />

                            {!previewUrl ? (
                                <label htmlFor="category-image" className="upload-label">
                                    <Upload size={32} />
                                    <span>Click to upload image</span>
                                    <small>PNG, JPG, GIF up to 5MB</small>
                                </label>
                            ) : (
                                <div className="image-preview-container">
                                    <img src={previewUrl} alt="Category preview" className="category-image-preview" />
                                    <div className="image-overlay">
                                        <button
                                            type="button"
                                            className="change-image-btn"
                                            onClick={() => document.getElementById('category-image').click()}
                                        >
                                            <Upload size={18} />
                                            Change Image
                                        </button>
                                        <button
                                            type="button"
                                            className="remove-image-btn"
                                            onClick={removeImage}
                                        >
                                            <X size={18} />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
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
                            {loading ? 'Saving...' : category ? 'Update Category' : 'Add Category'}
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

        .modal {
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          max-width: 550px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          animation: slideUp 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .form-group input,
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
        .form-group textarea:focus {
          outline: none;
          border-color: #FFD700;
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
        }

        .form-group input:disabled,
        .form-group textarea:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-group small {
          display: block;
          margin-top: 5px;
          color: #999;
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
          padding: 50px 20px;
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
          margin-top: 12px;
          font-weight: 600;
          color: #333;
        }

        .upload-label small {
          margin-top: 5px;
          color: #999;
          font-size: 12px;
        }

        .image-preview-container {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #eee;
        }

        .category-image-preview {
          width: 100%;
          height: 250px;
          object-fit: cover;
          display: block;
        }

        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          padding: 20px;
          display: flex;
          gap: 10px;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .image-preview-container:hover .image-overlay {
          opacity: 1;
        }

        .change-image-btn,
        .remove-image-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .change-image-btn {
          background: #FFD700;
          color: #000;
        }

        .change-image-btn:hover {
          background: #FFA500;
        }

        .remove-image-btn {
          background: #f44336;
          color: #fff;
        }

        .remove-image-btn:hover {
          background: #d32f2f;
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

          .form-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }

          .image-overlay {
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
};

export default CategoryModal;