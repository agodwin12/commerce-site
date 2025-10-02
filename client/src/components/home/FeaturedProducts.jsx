// src/components/home/FeaturedProducts.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import { api } from '../../utils/api';
import { ENDPOINTS } from '../../utils/constants';
import { useCart } from '../../context/CartContext.jsx';
import AnimatedText from '../common/AnimatedText';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            console.log('Fetching featured products...');
            const response = await api.get(ENDPOINTS.FEATURED_PRODUCTS);
            console.log('Featured products response:', response);

            if (response.success && response.data) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Error fetching featured products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);

        // Show success feedback
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
        return 'https://via.placeholder.com/400x400?text=No+Image';
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

    if (loading) {
        return (
            <section className="featured-section">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading featured products...</p>
                </div>
                <style>{`
          .featured-section {
            width: 100vw;
            margin-left: calc(-50vw + 50%);
            padding: 6rem 3rem;
            background: #0F0F0F;
            border-bottom: 1px solid #2a2a2a;
          }
          .loading-container {
            text-align: center;
            color: #D4AF37;
            font-size: 1.2rem;
            font-family: 'Poppins', sans-serif;
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
        `}</style>
            </section>
        );
    }

    return (
        <section className="featured-section" id="products">
            <div className="section-container">
                <AnimatedText direction="top" delay={100}>
                    <div className="section-header">
                        <div className="header-line"></div>
                        <h2>FEATURED PRODUCTS</h2>
                        <p>Discover our most popular healthcare products</p>
                        <div className="header-underline"></div>
                    </div>
                </AnimatedText>

                <div className="products-grid">
                    {products.map((product, index) => (
                        <AnimatedText
                            key={product.id}
                            direction={index % 2 === 0 ? "left" : "right"}
                            delay={200 + index * 100}
                        >
                            <Link
                                to="/shop"
                                className="product-card"
                                onMouseEnter={() => setHoveredProduct(product.id)}
                                onMouseLeave={() => setHoveredProduct(null)}
                            >
                                {product.is_featured && (
                                    <span className="featured-badge">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                        </svg>
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
                                            <Eye size={20} />
                                            <span>Quick View</span>
                                        </button>
                                        <button className="wishlist-btn">
                                            <Heart size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="product-info">
                                    <h3>{product.name}</h3>

                                    <div className="product-rating">
                                        <div className="stars">
                                            {renderStars(product.rating || 0)}
                                        </div>
                                        <span className="reviews">({product.total_reviews || 0} reviews)</span>
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

                                <div className="product-shine"></div>
                            </Link>
                        </AnimatedText>
                    ))}
                </div>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

        .featured-section {
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          padding: 6rem 3rem;
          background: #0F0F0F;
          border-bottom: 1px solid #2a2a2a;
          position: relative;
          overflow: hidden;
        }

        .featured-section::after {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.02) 0%, transparent 70%);
          animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .section-container {
          max-width: 1600px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
          position: relative;
        }

        .header-line {
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, transparent, #D4AF37, transparent);
          margin: 0 auto 1.5rem;
          border-radius: 2px;
          animation: expandLine 1s ease-out;
        }

        @keyframes expandLine {
          from { width: 0; opacity: 0; }
          to { width: 80px; opacity: 1; }
        }

        .section-header h2 {
          font-family: 'Poppins', sans-serif;
          font-size: 3.5rem;
          font-weight: 900;
          color: #D4AF37;
          margin: 0 0 1rem 0;
          letter-spacing: 3px;
          text-transform: uppercase;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-header p {
          color: #999;
          font-size: 1.2rem;
          font-family: 'Poppins', sans-serif;
          margin: 0;
          font-weight: 300;
          letter-spacing: 0.5px;
        }

        .header-underline {
          width: 120px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #D4AF37, transparent);
          margin: 1.5rem auto 0;
          border-radius: 2px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2.5rem;
          padding: 0 1rem;
        }

        .product-card {
          position: relative;
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          text-decoration: none;
          display: block;
        }

        .product-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, #D4AF37, #F4D03F);
          border-radius: 20px;
          opacity: 0;
          transition: opacity 0.5s;
          z-index: -1;
        }

        .product-card:hover {
          border-color: #D4AF37;
          transform: translateY(-10px);
          box-shadow: 0 20px 60px rgba(212, 175, 55, 0.3);
        }

        .product-card:hover::before {
          opacity: 0.2;
        }

        .featured-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          color: #0F0F0F;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: 0.75rem;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          box-shadow: 0 5px 15px rgba(212, 175, 55, 0.4);
          animation: badgePulse 2s ease-in-out infinite;
        }

        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .product-image {
          width: 100%;
          height: 320px;
          overflow: hidden;
          background: #0F0F0F;
          position: relative;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .product-card:hover .product-image img {
          transform: scale(1.15) rotate(2deg);
        }

        .product-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(15, 15, 15, 0.9) 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          opacity: 0;
          transition: opacity 0.4s;
        }

        .product-card:hover .product-overlay {
          opacity: 1;
        }

        .quick-view-btn, .wishlist-btn {
          background: rgba(212, 175, 55, 0.9);
          backdrop-filter: blur(10px);
          border: none;
          color: #0F0F0F;
          padding: 0.8rem 1.5rem;
          border-radius: 25px;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
          transform: translateY(20px);
        }

        .product-card:hover .quick-view-btn {
          transform: translateY(0);
          transition-delay: 0.1s;
        }

        .product-card:hover .wishlist-btn {
          transform: translateY(0);
          transition-delay: 0.2s;
        }

        .quick-view-btn:hover, .wishlist-btn:hover {
          background: #D4AF37;
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
        }

        .wishlist-btn {
          padding: 0.8rem;
          border-radius: 50%;
        }

        .product-shine {
          position: absolute;
          top: -100%;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: all 0.6s;
          pointer-events: none;
        }

        .product-card:hover .product-shine {
          top: 100%;
          left: 100%;
        }

        .product-info {
          padding: 1.8rem;
        }

        .product-info h3 {
          color: #fff;
          font-size: 1.2rem;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          margin: 0 0 1rem 0;
          min-height: 55px;
          line-height: 1.4;
          transition: color 0.3s;
        }

        .product-card:hover .product-info h3 {
          color: #D4AF37;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.2rem;
        }

        .stars {
          display: flex;
          gap: 3px;
        }

        .reviews {
          color: #999;
          font-size: 0.85rem;
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
        }

        .product-footer {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .price-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price {
          font-size: 1.8rem;
          font-weight: 800;
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stock {
          font-size: 0.85rem;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          padding: 0.4rem 1rem;
          border-radius: 15px;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .stock-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
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
          padding: 1rem;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          color: #0F0F0F;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: 0.5px;
          text-transform: uppercase;
          box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
        }

        .add-to-cart-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 35px rgba(212, 175, 55, 0.5);
          background: linear-gradient(135deg, #F4D03F 0%, #D4AF37 100%);
        }

        .add-to-cart-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }

        .add-to-cart-btn.added {
          background: #4CAF50;
          color: #fff;
        }

        @media (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 2rem;
          }

          .section-header h2 {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .featured-section {
            padding: 4rem 1.5rem;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1.5rem;
          }

          .section-header h2 {
            font-size: 2rem;
            letter-spacing: 2px;
          }

          .section-header p {
            font-size: 1rem;
          }

          .product-image {
            height: 280px;
          }
        }

        @media (max-width: 480px) {
          .products-grid {
            grid-template-columns: 1fr;
          }

          .section-header h2 {
            font-size: 1.8rem;
          }

          .product-card {
            max-width: 400px;
            margin: 0 auto;
          }
        }
      `}</style>
        </section>
    );
};

export default FeaturedProducts;