// src/pages/Shop.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Eye, Heart, Filter, X, ChevronDown, Grid as GridIcon, List } from 'lucide-react';
import { api } from '../utils/api';
import { ENDPOINTS } from '../utils/constants';
import { useCart } from '../context/CartContext';
import AnimatedText from '../components/common/AnimatedText';

const Shop = () => {


    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [sortBy, setSortBy] = useState('default');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const { addToCart } = useCart();

    // Get category from URL parameter
    const categoryIdFromUrl = searchParams.get('category');
    const [selectedCategory, setSelectedCategory] = useState(
        categoryIdFromUrl ? parseInt(categoryIdFromUrl) : null
    );

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        // Update URL when category changes
        if (selectedCategory) {
            setSearchParams({ category: selectedCategory });
        } else {
            setSearchParams({});
        }
    }, [selectedCategory, setSearchParams]);

    useEffect(() => {
        // Sync state with URL parameter on load
        if (categoryIdFromUrl) {
            setSelectedCategory(parseInt(categoryIdFromUrl));
        }
    }, [categoryIdFromUrl]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get(ENDPOINTS.PRODUCTS);
            if (response.success && response.data) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleAddToCart = (product, e) => {
        e.stopPropagation();
        addToCart(product);

        const button = e.currentTarget;
        button.classList.add('added');
        button.innerHTML = '<span>✓ Added!</span>';

        setTimeout(() => {
            button.classList.remove('added');
            button.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span>Add to Cart</span>
            `;
        }, 2000);
    };

    const getProductImage = (product) => {
        if (product.images && product.images.length > 0) {
            return `http://localhost:3000${product.images[0].image_url}`;
        }
        return 'https://via.placeholder.com/400x400?text=Product';
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <Star
                key={index}
                size={16}
                fill={index < Math.floor(rating) ? '#D4AF37' : 'none'}
                color="#D4AF37"
                strokeWidth={1.5}
            />
        ));
    };

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        setShowFilters(false);
    };

    const handleResetFilters = () => {
        setSelectedCategory(null);
        setPriceRange([0, 1000]);
        setSortBy('default');
        setSearchParams({});
    };

    // Get selected category name
    const selectedCategoryName = selectedCategory
        ? categories.find(cat => cat.id === selectedCategory)?.name
        : null;

    const filteredProducts = products
        .filter(product => !selectedCategory || product.category_id === selectedCategory)
        .filter(product => product.price >= priceRange[0] && product.price <= priceRange[1])
        .sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            return 0;
        });

    if (loading) {
        return (
            <div className="shop-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="shop-page">
            {/* Page Header */}
            <div className="shop-header">
                <AnimatedText direction="top" delay={100}>
                    <div className="header-content">
                        <h1>
                            {selectedCategoryName
                                ? `${selectedCategoryName}`
                                : 'Shop All Products'
                            }
                        </h1>
                        <p>
                            {selectedCategoryName
                                ? `Browse all ${selectedCategoryName.toLowerCase()} products`
                                : 'Discover our complete range of quality healthcare products'
                            }
                        </p>
                    </div>
                </AnimatedText>
            </div>

            <div className="shop-container">
                {/* Sidebar Filters */}
                <aside className={`shop-sidebar ${showFilters ? 'active' : ''}`}>
                    <div className="sidebar-header">
                        <h3>Filters</h3>
                        <button className="close-filters" onClick={() => setShowFilters(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div className="filter-section">
                        <h4>Categories</h4>
                        <div className="category-filters">
                            <button
                                className={`category-filter ${!selectedCategory ? 'active' : ''}`}
                                onClick={() => handleCategorySelect(null)}
                            >
                                All Products
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                                    onClick={() => handleCategorySelect(category.id)}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range Filter */}
                    <div className="filter-section">
                        <h4>Price Range</h4>
                        <div className="price-range">
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                            />
                            <div className="price-labels">
                                <span>${priceRange[0]}</span>
                                <span>${priceRange[1]}</span>
                            </div>
                        </div>
                    </div>

                    <button className="reset-filters" onClick={handleResetFilters}>
                        Reset Filters
                    </button>
                </aside>

                {/* Main Content */}
                <main className="shop-main">
                    {/* Toolbar */}
                    <div className="shop-toolbar">
                        <div className="toolbar-left">
                            <button
                                className="mobile-filter-toggle"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter size={18} />
                                Filters
                            </button>
                            <span className="results-count">
                                {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
                                {selectedCategoryName && ` in ${selectedCategoryName}`}
                            </span>
                        </div>

                        <div className="toolbar-right">
                            <div className="view-toggle">
                                <button
                                    className={viewMode === 'grid' ? 'active' : ''}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <GridIcon size={18} />
                                </button>
                                <button
                                    className={viewMode === 'list' ? 'active' : ''}
                                    onClick={() => setViewMode('list')}
                                >
                                    <List size={18} />
                                </button>
                            </div>

                            <div className="sort-dropdown">
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="default">Default Sorting</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name: A to Z</option>
                                </select>
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Products Grid/List */}
                    <div className={`products-container ${viewMode}`}>
                        {filteredProducts.length === 0 ? (
                            <div className="no-products">
                                <p>No products found matching your criteria.</p>
                                <button className="reset-filters-btn" onClick={handleResetFilters}>
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            filteredProducts.map((product, index) => (
                                <AnimatedText
                                    key={product.id}
                                    direction={index % 2 === 0 ? "left" : "right"}
                                    delay={100 + (index % 8) * 50}
                                >
                                    <div className="product-card"
                                         onClick={() => navigate(`/product/${product.id}`)}
                                         style={{ cursor: 'pointer' }}
                                    >


                                        {product.is_featured && (
                                            <span className="featured-badge">
                                                <Star size={12} fill="currentColor" />
                                                Featured
                                            </span>
                                        )}

                                        <div className="product-image">
                                            <img
                                                src={getProductImage(product)}
                                                alt={product.name}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x400?text=Product';
                                                }}
                                            />
                                            <div className="product-overlay">
                                                <button className="quick-view-btn">
                                                    <Eye size={18} />
                                                    Quick View
                                                </button>
                                                <button className="wishlist-btn">
                                                    <Heart size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="product-info">
                                            <h3>{product.name}</h3>

                                            <div className="product-rating">
                                                <div className="stars">
                                                    {renderStars(product.rating || 0)}
                                                </div>
                                                <span className="reviews">
                                                    ({product.total_reviews || 0})
                                                </span>
                                            </div>

                                            <div className="product-footer">
                                                <div className="price-section">
                                                    <span className="price">${product.price}</span>
                                                    {product.stock_quantity > 0 ? (
                                                        <span className="stock in-stock">
                                                            <span className="stock-dot"></span>
                                                            In Stock
                                                        </span>
                                                    ) : (
                                                        <span className="stock out-stock">
                                                            <span className="stock-dot"></span>
                                                            Out of Stock
                                                        </span>
                                                    )}
                                                </div>

                                                <button
                                                    className="add-to-cart-btn"
                                                    onClick={(e) => handleAddToCart(product, e)}
                                                    disabled={product.stock_quantity <= 0}
                                                >
                                                    <ShoppingCart size={18} />
                                                    <span>Add to Cart</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedText>
                            ))
                        )}
                    </div>
                </main>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

        * {
          box-sizing: border-box;
        }

        .shop-page {
          width: 100%;
          min-height: 100vh;
          background: #0F0F0F;
          padding-top: 80px;
          font-family: 'Poppins', sans-serif;
        }

        .loading-container {
          text-align: center;
          color: #D4AF37;
          padding: 4rem 0;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #2a2a2a;
          border-top-color: #D4AF37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .shop-header {
          background: linear-gradient(135deg, #1a1a1a 0%, #0F0F0F 100%);
          padding: 4rem 3rem;
          border-bottom: 1px solid #2a2a2a;
          width: 100%;
        }

        .header-content {
          max-width: 100%;
          margin: 0 auto;
          text-align: center;
        }

        .header-content h1 {
          font-size: 3rem;
          font-weight: 900;
          color: #D4AF37;
          margin: 0 0 1rem 0;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .header-content p {
          color: #999;
          font-size: 1.1rem;
          margin: 0;
          font-weight: 300;
        }

        .shop-container {
          width: 100%;
          padding: 3rem;
          display: flex;
          gap: 3rem;
        }

        /* Sidebar */
        .shop-sidebar {
          width: 280px;
          flex-shrink: 0;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 12px;
          padding: 2rem;
          height: fit-content;
          position: sticky;
          top: 100px;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .sidebar-header h3 {
          color: #D4AF37;
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
        }

        .close-filters {
          display: none;
          background: none;
          border: none;
          color: #D4AF37;
          cursor: pointer;
        }

        .filter-section {
          margin-bottom: 2.5rem;
        }

        .filter-section h4 {
          color: #fff;
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
        }

        .category-filters {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .category-filter {
          padding: 0.8rem 1rem;
          background: rgba(26, 26, 26, 0.6);
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          color: #999;
          font-family: 'Poppins', sans-serif;
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
          text-align: left;
        }

        .category-filter:hover {
          background: rgba(212, 175, 55, 0.1);
          border-color: #D4AF37;
          color: #D4AF37;
        }

        .category-filter.active {
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          border-color: #D4AF37;
          color: #0F0F0F;
          font-weight: 700;
        }

        .price-range input[type="range"] {
          width: 100%;
          height: 6px;
          background: #2a2a2a;
          border-radius: 3px;
          outline: none;
          -webkit-appearance: none;
        }

        .price-range input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          background: #D4AF37;
          border-radius: 50%;
          cursor: pointer;
        }

        .price-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
          color: #999;
          font-size: 0.9rem;
        }

        .reset-filters {
          width: 100%;
          padding: 0.9rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid #D4AF37;
          border-radius: 8px;
          color: #D4AF37;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }

        .reset-filters:hover {
          background: #D4AF37;
          color: #0F0F0F;
        }

        /* Main Content */
        .shop-main {
          flex: 1;
          min-width: 0;
        }

        .shop-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 12px;
        }

        .toolbar-left, .toolbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .mobile-filter-toggle {
          display: none;
          padding: 0.7rem 1.2rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid #D4AF37;
          border-radius: 8px;
          color: #D4AF37;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          cursor: pointer;
          gap: 0.5rem;
          align-items: center;
        }

        .results-count {
          color: #999;
          font-size: 0.95rem;
        }

        .view-toggle {
          display: flex;
          gap: 0.5rem;
          background: #0F0F0F;
          padding: 0.3rem;
          border-radius: 8px;
        }

        .view-toggle button {
          padding: 0.6rem;
          background: transparent;
          border: none;
          color: #999;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.3s;
        }

        .view-toggle button.active {
          background: #D4AF37;
          color: #0F0F0F;
        }

        .sort-dropdown {
          position: relative;
        }

        .sort-dropdown select {
          padding: 0.7rem 2.5rem 0.7rem 1rem;
          background: #0F0F0F;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
          cursor: pointer;
          appearance: none;
        }

        .sort-dropdown svg {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #D4AF37;
          pointer-events: none;
        }

        /* Products Grid/List */
        .products-container {
          display: grid;
          gap: 2rem;
        }

        .products-container.grid {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }

        .products-container.list {
          grid-template-columns: 1fr;
        }

        .products-container.list .product-card {
          display: flex;
          flex-direction: row;
        }

        .products-container.list .product-image {
          width: 300px;
          height: 300px;
        }

        .products-container.list .product-info {
          flex: 1;
        }

        .no-products {
          text-align: center;
          padding: 4rem 2rem;
          color: #999;
          grid-column: 1 / -1;
        }

        .no-products p {
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
        }

        .reset-filters-btn {
          padding: 0.9rem 2rem;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          border: none;
          border-radius: 25px;
          color: #0F0F0F;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }

        .reset-filters-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
        }

        /* Product Card */
        .product-card {
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.4s;
          position: relative;
        }

        .product-card:hover {
          border-color: #D4AF37;
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(212, 175, 55, 0.2);
        }

        .featured-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          color: #0F0F0F;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .product-image {
          width: 100%;
          height: 280px;
          overflow: hidden;
          background: #0F0F0F;
          position: relative;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .product-card:hover .product-image img {
          transform: scale(1.1);
        }

        .product-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 15, 15, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .product-card:hover .product-overlay {
          opacity: 1;
        }

        .quick-view-btn, .wishlist-btn {
          background: #D4AF37;
          border: none;
          color: #0F0F0F;
          padding: 0.7rem 1.2rem;
          border-radius: 25px;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
        }

        .quick-view-btn:hover, .wishlist-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
        }

        .wishlist-btn {
          padding: 0.7rem;
          border-radius: 50%;
        }

        .product-info {
          padding: 1.5rem;
        }

        .product-info h3 {
          color: #fff;
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.8rem 0;
          min-height: 50px;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .stars {
          display: flex;
          gap: 2px;
        }

        .reviews {
          color: #999;
          font-size: 0.85rem;
        }

        .product-footer {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .price-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price {
          font-size: 1.6rem;
          font-weight: 800;
          color: #D4AF37;
        }

        .stock {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.3rem 0.8rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .stock-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .stock.in-stock {
          background: rgba(76, 175, 80, 0.15);
          color: #4CAF50;
          border: 1px solid rgba(76, 175, 80, 0.3);
        }

        .stock.in-stock .stock-dot {
          background: #4CAF50;
        }

        .stock.out-stock {
          background: rgba(244, 67, 54, 0.15);
          color: #f44336;
          border: 1px solid rgba(244, 67, 54, 0.3);
        }

        .stock.out-stock .stock-dot {
          background: #f44336;
        }

        .add-to-cart-btn {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          color: #0F0F0F;
          border: none;
          border-radius: 25px;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s;
        }

        .add-to-cart-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
        }

        .add-to-cart-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .add-to-cart-btn.added {
          background: #4CAF50;
          color: #fff;
        }

        /* Responsive Design */
        
        /* Large Desktops */
        @media (max-width: 1440px) {
          .shop-container {
            padding: 3rem 2rem;
          }
        }

        /* Standard Desktops & Laptops */
        @media (max-width: 1200px) {
          .shop-container {
            padding: 2rem;
            gap: 2rem;
          }

          .products-container.grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 1.5rem;
          }

          .shop-header {
            padding: 3.5rem 2rem;
          }

          .header-content h1 {
            font-size: 2.8rem;
          }
        }

        /* Tablets Landscape */
        @media (max-width: 1024px) {
          .shop-sidebar {
            width: 260px;
            padding: 1.5rem;
          }

          .products-container.grid {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          }

          .header-content h1 {
            font-size: 2.5rem;
          }

          .shop-toolbar {
            padding: 1.2rem;
          }

          .view-toggle {
            display: none;
          }
        }

        /* Tablets Portrait & Mobile Landscape */
        @media (max-width: 968px) {
          .shop-page {
            padding-top: 70px;
          }

          .shop-header {
            padding: 3rem 1.5rem;
          }

          .header-content h1 {
            font-size: 2.3rem;
            letter-spacing: 1px;
          }

          .header-content p {
            font-size: 1rem;
          }

          .shop-container {
            flex-direction: column;
            padding: 1.5rem;
            gap: 0;
          }

          /* Mobile Sidebar */
          .shop-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 300px;
            max-width: 85vw;
            z-index: 2000;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 0;
            padding: 1.5rem;
            overflow-y: auto;
            box-shadow: 5px 0 30px rgba(0, 0, 0, 0.5);
          }

          .shop-sidebar.active {
            transform: translateX(0);
          }

          .shop-sidebar.active::after {
            content: '';
            position: fixed;
            top: 0;
            left: 300px;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: -1;
          }

          .close-filters {
            display: block;
          }

          .mobile-filter-toggle {
            display: flex;
          }

          .shop-toolbar {
            flex-wrap: wrap;
            padding: 1rem;
            gap: 0.8rem;
          }

          .toolbar-left {
            width: 100%;
            justify-content: space-between;
          }

          .toolbar-right {
            width: 100%;
            justify-content: flex-end;
          }

          .results-count {
            font-size: 0.85rem;
          }

          .products-container.grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 1.2rem;
          }

          .products-container.list {
            grid-template-columns: 1fr;
          }

          .products-container.list .product-card {
            flex-direction: column;
          }

          .products-container.list .product-image {
            width: 100%;
            height: 250px;
          }

          .product-image {
            height: 220px;
          }

          .product-info h3 {
            font-size: 1rem;
            min-height: 45px;
          }

          .price {
            font-size: 1.4rem;
          }
        }

        /* Large Mobile Phones */
        @media (max-width: 640px) {
          .shop-header {
            padding: 2.5rem 1.2rem;
          }

          .header-content h1 {
            font-size: 2rem;
            letter-spacing: 0.5px;
          }

          .header-content p {
            font-size: 0.95rem;
          }

          .shop-container {
            padding: 1.2rem;
          }

          .products-container.grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 1rem;
          }

          .product-card {
            border-radius: 12px;
          }

          .product-image {
            height: 200px;
          }

          .product-info {
            padding: 1.2rem;
          }

          .product-info h3 {
            font-size: 0.95rem;
            min-height: 40px;
          }

          .add-to-cart-btn {
            padding: 0.8rem;
            font-size: 0.85rem;
          }

          .shop-sidebar {
            width: 280px;
          }

          .filter-section h4 {
            font-size: 1rem;
          }

          .category-filter {
            padding: 0.7rem 0.9rem;
            font-size: 0.85rem;
          }
        }

        /* Standard Mobile Phones */
        @media (max-width: 480px) {
          .shop-page {
            padding-top: 65px;
          }

          .shop-header {
            padding: 2rem 1rem;
          }

          .header-content h1 {
            font-size: 1.8rem;
            margin-bottom: 0.8rem;
          }

          .header-content p {
            font-size: 0.9rem;
          }

          .shop-container {
            padding: 1rem;
          }

          .shop-toolbar {
            flex-direction: column;
            padding: 0.9rem;
            gap: 0.8rem;
            align-items: stretch;
          }

          .toolbar-left {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.8rem;
          }

          .toolbar-right {
            width: 100%;
            justify-content: space-between;
          }

          .mobile-filter-toggle {
            width: 100%;
            justify-content: center;
            padding: 0.8rem 1rem;
            font-size: 0.9rem;
          }

          .results-count {
            font-size: 0.8rem;
            width: 100%;
          }

          .sort-dropdown select {
            padding: 0.6rem 2rem 0.6rem 0.8rem;
            font-size: 0.85rem;
          }

          .products-container.grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .product-card {
            max-width: 100%;
          }

          .product-image {
            height: 250px;
          }

          .product-info h3 {
            font-size: 1rem;
            min-height: auto;
          }

          .product-rating {
            flex-wrap: wrap;
          }

          .stars svg {
            width: 14px;
            height: 14px;
          }

          .price {
            font-size: 1.5rem;
          }

          .stock {
            font-size: 0.75rem;
            padding: 0.25rem 0.6rem;
          }

          .add-to-cart-btn {
            padding: 0.85rem;
            font-size: 0.9rem;
          }

          .add-to-cart-btn svg {
            width: 16px;
            height: 16px;
          }

          .featured-badge {
            font-size: 0.65rem;
            padding: 0.35rem 0.7rem;
          }

          .quick-view-btn, .wishlist-btn {
            padding: 0.6rem 1rem;
            font-size: 0.8rem;
          }

          .wishlist-btn {
            padding: 0.6rem;
          }

          .shop-sidebar {
            width: 260px;
            padding: 1.2rem;
          }

          .sidebar-header h3 {
            font-size: 1.3rem;
          }

          .filter-section {
            margin-bottom: 2rem;
          }

          .no-products {
            padding: 3rem 1rem;
          }

          .no-products p {
            font-size: 1rem;
          }
        }

        /* Small Mobile Phones */
        @media (max-width: 375px) {
          .header-content h1 {
            font-size: 1.6rem;
          }

          .header-content p {
            font-size: 0.85rem;
          }

          .shop-container {
            padding: 0.8rem;
          }

          .shop-toolbar {
            padding: 0.8rem;
          }

          .products-container.grid {
            gap: 0.8rem;
          }

          .product-image {
            height: 220px;
          }

          .product-info {
            padding: 1rem;
          }

          .product-info h3 {
            font-size: 0.95rem;
          }

          .price {
            font-size: 1.3rem;
          }

          .add-to-cart-btn {
            padding: 0.75rem;
            font-size: 0.85rem;
          }

          .shop-sidebar {
            width: 240px;
            max-width: 90vw;
          }

          .category-filter {
            padding: 0.65rem 0.8rem;
            font-size: 0.8rem;
          }
        }

        /* Extra Small Mobile Phones */
        @media (max-width: 320px) {
          .header-content h1 {
            font-size: 1.4rem;
          }

          .header-content p {
            font-size: 0.8rem;
          }

          .product-image {
            height: 200px;
          }

          .product-info h3 {
            font-size: 0.9rem;
          }

          .price {
            font-size: 1.2rem;
          }

          .stock {
            font-size: 0.7rem;
          }

          .add-to-cart-btn {
            padding: 0.7rem;
            font-size: 0.8rem;
          }

          .shop-sidebar {
            width: 100%;
            max-width: 95vw;
          }

          .mobile-filter-toggle {
            font-size: 0.85rem;
            padding: 0.7rem 0.9rem;
          }
        }

        /* Touch Device Optimizations */
        @media (hover: none) and (pointer: coarse) {
          .product-overlay {
            display: none;
          }

          .category-filter,
          .reset-filters,
          .add-to-cart-btn,
          .mobile-filter-toggle,
          .quick-view-btn,
          .wishlist-btn {
            min-height: 44px;
            min-width: 44px;
          }

          .product-card:active {
            transform: scale(0.98);
          }

          .add-to-cart-btn:active:not(:disabled) {
            transform: scale(0.95);
          }
        }

        /* Landscape Orientation on Mobile */
        @media (max-width: 968px) and (orientation: landscape) {
          .shop-header {
            padding: 2rem 1.5rem;
          }

          .header-content h1 {
            font-size: 2rem;
          }

          .products-container.grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }

          .product-image {
            height: 200px;
          }
        }
      `}</style>
        </div>
    );
};

export default Shop;