import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Package } from 'lucide-react';
import { api } from '../../utils/api';
import { ENDPOINTS } from '../../utils/constants';
import ProductModal from './ProductModal';

const ProductsView = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            console.log('Fetching products...');
            const response = await api.get(ENDPOINTS.PRODUCTS);
            console.log('API Response:', response);

            if (response.success && response.data) {
                console.log('Products received:', response.data);
                console.log('First product:', response.data[0]);
                setProducts(Array.isArray(response.data) ? response.data : []);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(ENDPOINTS.PRODUCT_BY_ID(id));
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product');
            }
        }
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setShowModal(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getProductImage = (product) => {
        console.log('Getting image for product:', product.name);
        console.log('Product images:', product.images);

        if (product.images && product.images.length > 0) {
            const imagePath = product.images[0].image_url;
            console.log('Image path:', imagePath);

            // Check if path already starts with http
            if (imagePath.startsWith('http')) {
                return imagePath;
            }

            // Otherwise prepend the base URL
            const fullUrl = `http://185.98.136.21:3001${imagePath}`;
            console.log('Full image URL:', fullUrl);
            return fullUrl;
        }

        console.log('No images found for product:', product.name);
        return null;
    };

    return (
        <div className="products-view">
            <div className="data-table-container">
                <div className="table-header">
                    <div className="search-box">
                        <Search size={20} color="#666" />
                        <input
                            type="text"
                            placeholder="Search products by name or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="add-btn" onClick={handleAddNew}>
                        <Plus size={20} />
                        <span>Add Product</span>
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Loading products...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="no-data">
                        <p>No products found</p>
                        <button className="add-btn-secondary" onClick={handleAddNew}>
                            Add your first product
                        </button>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>Image</th>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredProducts.map(product => {
                                const imageUrl = getProductImage(product);
                                return (
                                    <tr key={product.id}>
                                        <td>
                                            <div className="product-image-cell">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={product.name}
                                                        onError={(e) => {
                                                            console.error('Image failed to load:', imageUrl);
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div className="no-image" style={{ display: imageUrl ? 'none' : 'flex' }}>
                                                    <Package size={20} />
                                                </div>
                                            </div>
                                        </td>
                                        <td>#{product.id}</td>
                                        <td className="product-name">{product.name}</td>
                                        <td className="price">${product.price}</td>
                                        <td>
                                            <span className={`stock-badge ${product.stock_quantity > 10 ? 'in-stock' : product.stock_quantity > 0 ? 'low-stock' : 'out-of-stock'}`}>
                                                {product.stock_quantity || 0} units
                                            </span>
                                        </td>
                                        <td>{product.category?.name || 'Uncategorized'}</td>
                                        <td>
                                            <span className={`status-badge ${product.stock_quantity > 0 ? 'active' : 'inactive'}`}>
                                                {product.stock_quantity > 0 ? 'Active' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="icon-btn view" title="View details">
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    className="icon-btn edit"
                                                    onClick={() => handleEdit(product)}
                                                    title="Edit product"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    className="icon-btn delete"
                                                    onClick={() => handleDelete(product.id)}
                                                    title="Delete product"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <ProductModal
                    product={editingProduct}
                    onClose={() => setShowModal(false)}
                    onSave={() => {
                        setShowModal(false);
                        fetchProducts();
                    }}
                />
            )}

            <style>{`
        .products-view {
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
          padding: 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f5f5f5;
          padding: 10px 15px;
          border-radius: 8px;
          flex: 1;
          max-width: 400px;
          min-width: 250px;
        }

        .search-box input {
          border: none;
          background: none;
          flex: 1;
          outline: none;
          font-size: 14px;
          color: #333;
        }

        .search-box input::placeholder {
          color: #999;
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

        .loading, .no-data {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .no-data p {
          margin-bottom: 20px;
          font-size: 16px;
        }

        .add-btn-secondary {
          background: #f0f0f0;
          color: #333;
          border: 2px dashed #ccc;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }

        .add-btn-secondary:hover {
          background: #e8e8e8;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          background: #f8f9fa;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #eee;
          white-space: nowrap;
        }

        .data-table td {
          padding: 15px;
          border-bottom: 1px solid #eee;
          color: #666;
        }

        .data-table tr:hover {
          background: #f8f9fa;
        }

        .product-image-cell {
          width: 50px;
          height: 50px;
          position: relative;
        }

        .product-image-cell img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid #eee;
        }

        .no-image {
          width: 50px;
          height: 50px;
          background: #f5f5f5;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          border: 2px solid #eee;
        }

        .product-name {
          font-weight: 600;
          color: #1a1a1a;
        }

        .price {
          font-weight: 600;
          color: #4CAF50;
        }

        .stock-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .stock-badge.in-stock {
          background: #d4edda;
          color: #155724;
        }

        .stock-badge.low-stock {
          background: #fff3cd;
          color: #856404;
        }

        .stock-badge.out-of-stock {
          background: #f8d7da;
          color: #721c24;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.active {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.inactive {
          background: #f8d7da;
          color: #721c24;
        }

        .action-btns {
          display: flex;
          gap: 8px;
        }

        .icon-btn {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-btn:hover {
          background: #f0f0f0;
          transform: scale(1.1);
        }

        .icon-btn.view { color: #2196F3; }
        .icon-btn.edit { color: #4CAF50; }
        .icon-btn.delete { color: #f44336; }

        @media (max-width: 768px) {
          .table-header {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            max-width: 100%;
          }

          .add-btn {
            justify-content: center;
          }

          .data-table {
            font-size: 14px;
          }

          .data-table th,
          .data-table td {
            padding: 10px;
          }
        }
      `}</style>
        </div>
    );
};

export default ProductsView;