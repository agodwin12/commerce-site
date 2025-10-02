import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package, Image as ImageIcon } from 'lucide-react';
import { api } from '../../utils/api';
import { ENDPOINTS } from '../../utils/constants';
import CategoryModal from './CategoryModal';

const CategoriesView = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get(ENDPOINTS.CATEGORIES);
            if (response.success && response.data) {
                setCategories(Array.isArray(response.data) ? response.data : []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            try {
                await api.delete(ENDPOINTS.CATEGORY_BY_ID(id));
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Failed to delete category. It might have associated products.');
            }
        }
    };

    const handleAddNew = () => {
        setEditingCategory(null);
        setShowModal(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setShowModal(true);
    };

    const getCategoryImage = (category) => {
        if (category.image_url) {
            return `http://localhost:3000${category.image_url}`;
        }
        return null;
    };

    return (
        <div className="categories-view">
            <div className="data-table-container">
                <div className="table-header">
                    <div className="header-info">
                        <h3>Manage Categories</h3>
                        <p>Organize your products into categories</p>
                    </div>
                    <button className="add-btn" onClick={handleAddNew}>
                        <Plus size={20} />
                        <span>Add Category</span>
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Loading categories...</div>
                ) : categories.length === 0 ? (
                    <div className="no-data">
                        <Package size={64} color="#ccc" />
                        <p>No categories yet</p>
                        <button className="add-btn-secondary" onClick={handleAddNew}>
                            Create your first category
                        </button>
                    </div>
                ) : (
                    <div className="categories-grid">
                        {categories.map(category => {
                            const imageUrl = getCategoryImage(category);
                            return (
                                <div key={category.id} className="category-card">
                                    <div className="category-image-container">
                                        {imageUrl ? (
                                            <img src={imageUrl} alt={category.name} className="category-image" />
                                        ) : (
                                            <div className="category-icon-placeholder">
                                                <Package size={40} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="category-info">
                                        <h4>{category.name}</h4>
                                        {category.description && (
                                            <p className="category-description">{category.description}</p>
                                        )}
                                        <p className="product-count">
                                            {category.product_count || 0} {(category.product_count || 0) === 1 ? 'Product' : 'Products'}
                                        </p>
                                    </div>
                                    <div className="category-actions">
                                        <button
                                            className="icon-btn edit"
                                            onClick={() => handleEdit(category)}
                                            title="Edit category"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            className="icon-btn delete"
                                            onClick={() => handleDelete(category.id)}
                                            title="Delete category"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {showModal && (
                <CategoryModal
                    category={editingCategory}
                    onClose={() => setShowModal(false)}
                    onSave={() => {
                        setShowModal(false);
                        fetchCategories();
                    }}
                />
            )}

            <style>{`
        .categories-view {
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .data-table-container {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .table-header {
          padding: 25px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .header-info h3 {
          font-size: 22px;
          color: #1a1a1a;
          margin: 0 0 5px 0;
        }

        .header-info p {
          color: #666;
          font-size: 14px;
          margin: 0;
        }

        .add-btn {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          color: #000;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
        }

        .loading {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .no-data {
          text-align: center;
          padding: 80px 20px;
          color: #666;
        }

        .no-data p {
          margin: 20px 0;
          font-size: 18px;
          color: #999;
        }

        .add-btn-secondary {
          background: #f0f0f0;
          color: #333;
          border: 2px dashed #ccc;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .add-btn-secondary:hover {
          background: #e8e8e8;
          border-color: #FFD700;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          padding: 25px;
        }

        .category-card {
          background: #fff;
          border: 2px solid #f0f0f0;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s;
          position: relative;
        }

        .category-card:hover {
          border-color: #FFD700;
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .category-image-container {
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #f5f5f5;
          position: relative;
        }

        .category-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .category-card:hover .category-image {
          transform: scale(1.05);
        }

        .category-icon-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          color: #000;
        }

        .category-info {
          padding: 20px;
        }

        .category-info h4 {
          font-size: 18px;
          color: #1a1a1a;
          margin: 0 0 8px 0;
          font-weight: 600;
        }

        .category-description {
          color: #666;
          font-size: 14px;
          margin: 0 0 12px 0;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-count {
          color: #999;
          font-size: 14px;
          margin: 0;
          font-weight: 500;
        }

        .category-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          padding: 15px 20px;
          border-top: 1px solid #f0f0f0;
          background: #fafafa;
        }

        .icon-btn {
          background: #fff;
          border: 1px solid #e0e0e0;
          padding: 8px;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-btn:hover {
          transform: scale(1.1);
        }

        .icon-btn.edit { 
          color: #4CAF50;
          border-color: #4CAF50;
        }

        .icon-btn.edit:hover {
          background: #4CAF50;
          color: #fff;
        }
        
        .icon-btn.delete { 
          color: #f44336;
          border-color: #f44336;
        }

        .icon-btn.delete:hover {
          background: #f44336;
          color: #fff;
        }

        @media (max-width: 768px) {
          .table-header {
            flex-direction: column;
            align-items: stretch;
          }

          .add-btn {
            justify-content: center;
          }

          .categories-grid {
            grid-template-columns: 1fr;
            padding: 20px;
          }
        }
      `}</style>
        </div>
    );
};

export default CategoriesView;