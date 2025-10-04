// src/pages/ProductDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw, Share2 } from 'lucide-react';
import { api } from '../utils/api';
import { ENDPOINTS } from '../utils/constants';
import { useCart } from '../context/CartContext';
import AnimatedText from '../components/common/AnimatedText';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchProductDetails();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`${ENDPOINTS.PRODUCTS}/${id}`);
            if (response.success && response.data) {
                setProduct(response.data);
                fetchRelatedProducts(response.data.category_id);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedProducts = async (categoryId) => {
        try {
            const response = await api.get(ENDPOINTS.PRODUCTS);
            if (response.success && response.data) {
                const filtered = response.data
                    .filter(p => p.id !== parseInt(id) && p.category_id === categoryId)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 6);
                setRelatedProducts(filtered);
            }
        } catch (error) {
            console.error('Error fetching related products:', error);
        }
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        const btn = document.querySelector('.add-to-cart-main');
        if (btn) {
            btn.classList.add('added');
            setTimeout(() => btn.classList.remove('added'), 2000);
        }
    };

    const getProductImages = () => {
        if (!product) return [];
        if (product.images && product.images.length > 0) {
            return product.images.map(img => {
                // Check if it's already a full URL
                if (img.image_url.startsWith('http')) {
                    return img.image_url;
                }
                return `http://localhost:3000${img.image_url}`;
            });
        }
        return ['https://via.placeholder.com/600x600?text=Product'];
    };

    const getProductImage = (prod) => {
        if (prod.images && prod.images.length > 0) {
            const imagePath = prod.images[0].image_url;

            // Check if it's already a full URL
            if (imagePath.startsWith('http')) {
                return imagePath;
            }
            return `http://localhost:3000${imagePath}`;
        }
        return 'https://via.placeholder.com/300x300?text=Product';
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <Star
                key={index}
                size={20}
                fill={index < Math.floor(rating) ? '#D4AF37' : 'none'}
                color="#D4AF37"
                strokeWidth={1.5}
            />
        ));
    };

    const renderStarsSmall = (rating) => {
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

    const nextImage = () => {
        const images = getProductImages();
        setSelectedImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        const images = getProductImages();
        setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (loading) {
        return (
            <div className="product-details-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-details-page">
                <div className="error-container">
                    <h2>Product Not Found</h2>
                    <button onClick={() => navigate('/shop')} className="back-btn">
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    const images = getProductImages();

    return (
        <div className="product-details-page">
            {/* Breadcrumb */}
            <AnimatedText direction="top" delay={50}>
                <div className="breadcrumb">
                    <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
                    <span>/</span>
                    <span onClick={() => navigate('/shop')} style={{ cursor: 'pointer' }}>Shop</span>
                    <span>/</span>
                    <span>{product.name}</span>
                </div>
            </AnimatedText>

            {/* Product Details Section */}
            <div className="product-details-container">
                {/* Image Gallery */}
                <AnimatedText direction="left" delay={100}>
                    <div className="image-gallery">
                        <div className="main-image">
                            <img
                                src={images[selectedImageIndex]}
                                alt={product.name}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/600x600?text=Product';
                                }}
                            />
                            {images.length > 1 && (
                                <>
                                    <button className="nav-btn prev" onClick={prevImage}>
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button className="nav-btn next" onClick={nextImage}>
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="thumbnail-grid">
                                {images.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                                        onClick={() => setSelectedImageIndex(index)}
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.name} ${index + 1}`}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/100x100?text=Product';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </AnimatedText>

                {/* Product Info */}
                <AnimatedText direction="right" delay={100}>
                    <div className="product-info-section">
                        {product.is_featured && (
                            <span className="featured-badge">
                                <Star size={14} fill="currentColor" />
                                Featured Product
                            </span>
                        )}

                        <h1>{product.name}</h1>

                        <div className="rating-section">
                            <div className="stars">{renderStars(product.rating || 0)}</div>
                            <span className="reviews">({product.total_reviews || 0} Reviews)</span>
                        </div>

                        <div className="price-section">
                            <span className="price">${product.price}</span>
                            {product.stock_quantity > 0 ? (
                                <span className="stock in-stock">
                                    <span className="stock-dot"></span>
                                    In Stock ({product.stock_quantity} available)
                                </span>
                            ) : (
                                <span className="stock out-stock">
                                    <span className="stock-dot"></span>
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        <div className="description">
                            <h3>Description</h3>
                            <p>{product.description || 'No description available for this product.'}</p>
                        </div>

                        <div className="quantity-section">
                            <label>Quantity:</label>
                            <div className="quantity-controls">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                    disabled={quantity >= product.stock_quantity}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button
                                className="add-to-cart-main"
                                onClick={handleAddToCart}
                                disabled={product.stock_quantity <= 0}
                            >
                                <ShoppingCart size={20} />
                                Add to Cart
                            </button>
                            <button className="wishlist-btn">
                                <Heart size={20} />
                            </button>
                            <button className="share-btn">
                                <Share2 size={20} />
                            </button>
                        </div>

                        <div className="features-grid">
                            <div className="feature">
                                <Truck size={24} />
                                <div>
                                    <strong>Free Shipping</strong>
                                    <p>On orders over $100</p>
                                </div>
                            </div>
                            <div className="feature">
                                <RotateCcw size={24} />
                                <div>
                                    <strong>30 Days Return</strong>
                                    <p>Money back guarantee</p>
                                </div>
                            </div>
                            <div className="feature">
                                <Shield size={24} />
                                <div>
                                    <strong>Secure Payment</strong>
                                    <p>100% secure payment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedText>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="related-products-section">
                    <AnimatedText direction="top" delay={150}>
                        <h2>You May Also Like</h2>
                    </AnimatedText>

                    <div className="related-products-grid">
                        {relatedProducts.map((relProduct, index) => (
                            <AnimatedText
                                key={relProduct.id}
                                direction={index % 2 === 0 ? "left" : "right"}
                                delay={200 + (index * 50)}
                            >
                                <div
                                    className="related-product-card"
                                    onClick={() => navigate(`/product/${relProduct.id}`)}
                                >
                                    <div className="related-product-image">
                                        <img
                                            src={getProductImage(relProduct)}
                                            alt={relProduct.name}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x300?text=Product';
                                            }}
                                        />
                                    </div>
                                    <div className="related-product-info">
                                        <h4>{relProduct.name}</h4>
                                        <div className="stars-small">
                                            {renderStarsSmall(relProduct.rating || 0)}
                                        </div>
                                        <span className="related-price">${relProduct.price}</span>
                                    </div>
                                </div>
                            </AnimatedText>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

                * {
                    box-sizing: border-box;
                }

                .product-details-page {
                    width: 100%;
                    min-height: 100vh;
                    background: #0F0F0F;
                    padding-top: 100px;
                    padding-bottom: 4rem;
                    font-family: 'Poppins', sans-serif;
                }

                .loading-container, .error-container {
                    text-align: center;
                    color: #D4AF37;
                    padding: 4rem 2rem;
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

                .error-container h2 {
                    color: #fff;
                    margin-bottom: 1.5rem;
                }

                .back-btn {
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

                .back-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
                }

                .breadcrumb {
                    max-width: 1400px;
                    margin: 0 auto 2rem;
                    padding: 0 3rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #999;
                    font-size: 0.9rem;
                }

                .breadcrumb span:not(:last-child) {
                    color: #D4AF37;
                    transition: color 0.3s;
                }

                .breadcrumb span:not(:last-child):hover {
                    color: #F4D03F;
                }

                .breadcrumb span:last-child {
                    color: #fff;
                }

                .product-details-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 3rem;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                }

                /* Image Gallery */
                .image-gallery {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .main-image {
                    position: relative;
                    width: 100%;
                    height: 600px;
                    background: #1a1a1a;
                    border: 2px solid #2a2a2a;
                    border-radius: 16px;
                    overflow: hidden;
                }

                .main-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .nav-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(212, 175, 55, 0.9);
                    border: none;
                    color: #0F0F0F;
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                    z-index: 10;
                }

                .nav-btn:hover {
                    background: #D4AF37;
                    transform: translateY(-50%) scale(1.1);
                }

                .nav-btn.prev {
                    left: 1rem;
                }

                .nav-btn.next {
                    right: 1rem;
                }

                .thumbnail-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                    gap: 1rem;
                }

                .thumbnail {
                    height: 100px;
                    border: 2px solid #2a2a2a;
                    border-radius: 12px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .thumbnail:hover,
                .thumbnail.active {
                    border-color: #D4AF37;
                }

                .thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                /* Product Info */
                .product-info-section {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .featured-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
                    color: #0F0F0F;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    width: fit-content;
                }

                .product-info-section h1 {
                    color: #fff;
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin: 0;
                    line-height: 1.2;
                }

                .rating-section {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .stars {
                    display: flex;
                    gap: 4px;
                }

                .reviews {
                    color: #999;
                    font-size: 0.95rem;
                }

                .price-section {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    padding: 1.5rem 0;
                    border-top: 1px solid #2a2a2a;
                    border-bottom: 1px solid #2a2a2a;
                }

                .price {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #D4AF37;
                }

                .stock {
                    font-size: 0.9rem;
                    font-weight: 600;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .stock-dot {
                    width: 8px;
                    height: 8px;
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

                .description h3 {
                    color: #fff;
                    font-size: 1.3rem;
                    font-weight: 700;
                    margin: 0 0 0.8rem 0;
                }

                .description p {
                    color: #999;
                    line-height: 1.8;
                    margin: 0;
                }

                .quantity-section {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .quantity-section label {
                    color: #fff;
                    font-weight: 600;
                    font-size: 1.1rem;
                }

                .quantity-controls {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: #1a1a1a;
                    border: 2px solid #2a2a2a;
                    border-radius: 12px;
                    padding: 0.5rem 1rem;
                }

                .quantity-controls button {
                    width: 35px;
                    height: 35px;
                    background: #D4AF37;
                    border: none;
                    border-radius: 8px;
                    color: #0F0F0F;
                    font-size: 1.3rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .quantity-controls button:hover:not(:disabled) {
                    background: #F4D03F;
                    transform: scale(1.1);
                }

                .quantity-controls button:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .quantity-controls span {
                    color: #fff;
                    font-size: 1.2rem;
                    font-weight: 700;
                    min-width: 40px;
                    text-align: center;
                }

                .action-buttons {
                    display: flex;
                    gap: 1rem;
                }

                .add-to-cart-main {
                    flex: 1;
                    padding: 1rem 2rem;
                    background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
                    border: none;
                    border-radius: 25px;
                    color: #0F0F0F;
                    font-family: 'Poppins', sans-serif;
                    font-weight: 700;
                    font-size: 1.1rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.7rem;
                    transition: all 0.3s;
                }

                .add-to-cart-main:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
                }

                .add-to-cart-main:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .add-to-cart-main.added {
                    background: #4CAF50;
                    color: #fff;
                }

                .wishlist-btn,
                .share-btn {
                    width: 55px;
                    height: 55px;
                    background: rgba(212, 175, 55, 0.1);
                    border: 2px solid #D4AF37;
                    border-radius: 12px;
                    color: #D4AF37;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                }

                .wishlist-btn:hover,
                .share-btn:hover {
                    background: #D4AF37;
                    color: #0F0F0F;
                    transform: translateY(-2px);
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                    margin-top: 1rem;
                }

                .feature {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 1.5rem;
                    background: #1a1a1a;
                    border: 1px solid #2a2a2a;
                    border-radius: 12px;
                }

                .feature svg {
                    color: #D4AF37;
                    flex-shrink: 0;
                }

                .feature strong {
                    display: block;
                    color: #fff;
                    font-size: 0.95rem;
                    margin-bottom: 0.3rem;
                }

                .feature p {
                    color: #999;
                    font-size: 0.85rem;
                    margin: 0;
                }

                /* Related Products */
                .related-products-section {
                    max-width: 1400px;
                    margin: 5rem auto 0;
                    padding: 0 3rem;
                }

                .related-products-section h2 {
                    color: #fff;
                    font-size: 2.5rem;
                    font-weight: 800;
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .related-products-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 2rem;
                }

                .related-product-card {
                    background: #1a1a1a;
                    border: 2px solid #2a2a2a;
                    border-radius: 16px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.4s;
                }

                .related-product-card:hover {
                    border-color: #D4AF37;
                    transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(212, 175, 55, 0.2);
                }

                .related-product-image {
                    width: 100%;
                    height: 250px;
                    overflow: hidden;
                    background: #0F0F0F;
                }

                .related-product-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s;
                }

                .related-product-card:hover .related-product-image img {
                    transform: scale(1.1);
                }

                .related-product-info {
                    padding: 1.5rem;
                }

                .related-product-info h4 {
                    color: #fff;
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin: 0 0 0.8rem 0;
                    min-height: 50px;
                }

                .stars-small {
                    display: flex;
                    gap: 2px;
                    margin-bottom: 0.8rem;
                }

                .related-price {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #D4AF37;
                }

                /* Responsive Design */
                @media (max-width: 1024px) {
                    .product-details-container {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                        padding: 0 2rem;
                    }

                    .breadcrumb {
                        padding: 0 2rem;
                    }

                    .related-products-section {
                        padding: 0 2rem;
                    }

                    .features-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 768px) {
                    .product-details-page {
                        padding-top: 80px;
                    }

                    .breadcrumb {
                        padding: 0 1.5rem;
                        font-size: 0.85rem;
                    }

                    .product-details-container {
                        padding: 0 1.5rem;
                        gap: 2rem;
                    }

                    .main-image {
                        height: 400px;
                    }

                    .product-info-section h1 {
                        font-size: 2rem;
                    }

                    .price {
                        font-size: 2rem;
                    }

                    .action-buttons {
                        flex-direction: column;
                    }

                    .wishlist-btn,
                    .share-btn {
                        width: 100%;
                        height: 50px;
                    }

                    .related-products-section {
                        padding: 0 1.5rem;
                        margin-top: 3rem;
                    }

                    .related-products-section h2 {
                        font-size: 2rem;
                    }

                    .related-products-grid {
                        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                        gap: 1.5rem;
                    }
                }

                @media (max-width: 480px) {
                    .breadcrumb {
                        padding: 0 1rem;
                        font-size: 0.8rem;
                    }

                    .product-details-container {
                        padding: 0 1rem;
                    }

                    .main-image {
                        height: 320px;
                    }

                    .thumbnail-grid {
                        grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
                        gap: 0.8rem;
                    }

                    .thumbnail {
                        height: 70px;
                    }

                    .product-info-section h1 {
                        font-size: 1.6rem;
                    }

                    .price-section {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }

                    .quantity-section {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .related-products-section {
                        padding: 0 1rem;
                    }

                    .related-products-section h2 {
                        font-size: 1.6rem;
                    }

                    .related-products-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductDetailsPage;