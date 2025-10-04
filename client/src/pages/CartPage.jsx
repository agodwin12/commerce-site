// src/pages/CartPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import AnimatedText from '../components/common/AnimatedText';

const CartPage = () => {
    const navigate = useNavigate();
    const { cart, loading, updateCartItemQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
    const [removing, setRemoving] = useState(null);

    const getProductImage = (item) => {
        if (item.product?.images && item.product.images.length > 0) {
            const imagePath = item.product.images[0].image_url;

            // Check if it's already a full URL
            if (imagePath.startsWith('http')) {
                return imagePath;
            }

            return `http://localhost:3000${imagePath}`;
        }
        return 'https://via.placeholder.com/150x150?text=Product';
    };

    const handleQuantityChange = async (itemId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity >= 1) {
            await updateCartItemQuantity(itemId, newQuantity);
        }
    };

    const handleRemoveItem = async (itemId) => {
        setRemoving(itemId);
        await removeFromCart(itemId);
        setRemoving(null);
    };

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            await clearCart();
        }
    };

    const handleCheckout = () => {
        // Navigate to checkout page
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div className="cart-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading cart...</p>
                </div>
            </div>
        );
    }

    // Safety check for cart data
    const safeCart = Array.isArray(cart) ? cart : [];

    if (safeCart.length === 0) {
        console.log('First cart item:', safeCart[0]);
        console.log('First item product:', safeCart[0].product);
        console.log('First item product images:', safeCart[0].product?.images);
        return (
            <div className="cart-page">
                <AnimatedText direction="top" delay={50}>
                    <div className="empty-cart">
                        <ShoppingBag size={120} />
                        <h2>Your Cart is Empty</h2>
                        <p>Looks like you haven't added any items to your cart yet.</p>
                        <button className="continue-shopping-btn" onClick={() => navigate('/shop')}>
                            <ShoppingCart size={20} />
                            Continue Shopping
                        </button>
                    </div>
                </AnimatedText>
            </div>
        );
    }

    const subtotal = getCartTotal() || 0;
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    return (
        <div className="cart-page">
            {/* Page Header */}
            <AnimatedText direction="top" delay={50}>
                <div className="cart-header">
                    <div className="header-content">
                        <h1>Shopping Cart</h1>
                        <p>{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
                    </div>
                </div>
            </AnimatedText>

            <div className="cart-container">
                {/* Cart Items Section */}
                <div className="cart-items-section">
                    <AnimatedText direction="left" delay={100}>
                        <div className="cart-actions">
                            <button className="back-btn" onClick={() => navigate('/shop')}>
                                <ArrowLeft size={18} />
                                Continue Shopping
                            </button>
                            <button className="clear-cart-btn" onClick={handleClearCart}>
                                <Trash2 size={18} />
                                Clear Cart
                            </button>
                        </div>
                    </AnimatedText>

                    {safeCart.map((item, index) => (
                        <AnimatedText
                            key={item.id}
                            direction="left"
                            delay={150 + (index * 50)}
                        >
                            <div className={`cart-item ${removing === item.id ? 'removing' : ''}`}>
                                <div className="item-image" onClick={() => navigate(`/product/${item.product_id}`)}>
                                    <img
                                        src={getProductImage(item)}
                                        alt={item.product?.name}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/150x150?text=Product';
                                        }}
                                    />
                                </div>

                                <div className="item-details">
                                    <h3 onClick={() => navigate(`/product/${item.product_id}`)}>
                                        {item.product?.name || 'Product'}
                                    </h3>
                                    <p className="item-description">
                                        {item.product?.description?.substring(0, 100) || 'No description available'}
                                        {item.product?.description?.length > 100 ? '...' : ''}
                                    </p>
                                    <div className="item-stock">
                                        {item.product?.stock_quantity > 0 ? (
                                            <span className="in-stock">In Stock</span>
                                        ) : (
                                            <span className="out-stock">Out of Stock</span>
                                        )}
                                    </div>
                                </div>

                                <div className="item-quantity">
                                    <label>Quantity</label>
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                            disabled={item.quantity >= item.product?.stock_quantity}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="item-price">
                                    <span className="price">${(parseFloat(item.product?.price) || 0).toFixed(2)}</span>
                                    <span className="subtotal">
                                        ${((parseFloat(item.product?.price) || 0) * (parseInt(item.quantity) || 0)).toFixed(2)}
                                    </span>
                                </div>

                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemoveItem(item.id)}
                                    disabled={removing === item.id}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </AnimatedText>
                    ))}
                </div>

                {/* Order Summary Section */}
                <AnimatedText direction="right" delay={100}>
                    <div className="order-summary">
                        <h2>Order Summary</h2>

                        <div className="summary-row">
                            <span>Subtotal ({safeCart.length} items)</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                        </div>

                        {shipping === 0 && (
                            <div className="free-shipping-notice">
                                🎉 You qualify for free shipping!
                            </div>
                        )}

                        {subtotal < 100 && subtotal > 0 && (
                            <div className="shipping-notice">
                                Add ${(100 - subtotal).toFixed(2)} more for free shipping
                            </div>
                        )}

                        <div className="summary-row">
                            <span>Tax (10%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <button className="checkout-btn" onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>

                        <div className="payment-methods">
                            <p>We accept:</p>
                            <div className="payment-icons">
                                <span>💳</span>
                                <span>💰</span>
                                <span>📱</span>
                            </div>
                        </div>
                    </div>
                </AnimatedText>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

                * {
                    box-sizing: border-box;
                }

                .cart-page {
                    width: 100%;
                    min-height: 100vh;
                    background: #0F0F0F;
                    padding-top: 100px;
                    padding-bottom: 4rem;
                    font-family: 'Poppins', sans-serif;
                }

                .loading-container {
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

                .cart-header {
                    background: linear-gradient(135deg, #1a1a1a 0%, #0F0F0F 100%);
                    padding: 4rem 3rem;
                    border-bottom: 1px solid #2a2a2a;
                    width: 100%;
                }

                .header-content {
                    max-width: 1400px;
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

                /* Empty Cart */
                .empty-cart {
                    text-align: center;
                    padding: 6rem 2rem;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .empty-cart svg {
                    color: #2a2a2a;
                    margin-bottom: 2rem;
                }

                .empty-cart h2 {
                    color: #fff;
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                }

                .empty-cart p {
                    color: #999;
                    font-size: 1.1rem;
                    margin-bottom: 2rem;
                }

                .continue-shopping-btn {
                    padding: 1.2rem 3rem;
                    background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
                    border: none;
                    border-radius: 50px;
                    color: #0F0F0F;
                    font-family: 'Poppins', sans-serif;
                    font-weight: 800;
                    font-size: 1.15rem;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.8rem;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
                }

                .continue-shopping-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                    transition: left 0.5s;
                }

                .continue-shopping-btn:hover::before {
                    left: 100%;
                }

                .continue-shopping-btn:hover {
                    transform: translateY(-3px) scale(1.02);
                    box-shadow: 0 15px 40px rgba(212, 175, 55, 0.5);
                }

                .continue-shopping-btn:active {
                    transform: translateY(-1px) scale(0.98);
                }

                /* Cart Container */
                .cart-container {
                    max-width: 1400px;
                    margin: 3rem auto;
                    padding: 0 3rem;
                    display: grid;
                    grid-template-columns: 1fr 400px;
                    gap: 3rem;
                }

                /* Cart Items Section */
                .cart-items-section {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .cart-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .back-btn,
                .clear-cart-btn {
                    padding: 0.8rem 1.5rem;
                    background: rgba(212, 175, 55, 0.1);
                    border: 1px solid #D4AF37;
                    border-radius: 8px;
                    color: #D4AF37;
                    font-family: 'Poppins', sans-serif;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.3s;
                }

                .back-btn:hover,
                .clear-cart-btn:hover {
                    background: #D4AF37;
                    color: #0F0F0F;
                }

                .clear-cart-btn {
                    background: rgba(244, 67, 54, 0.1);
                    border-color: #f44336;
                    color: #f44336;
                }

                .clear-cart-btn:hover {
                    background: #f44336;
                    color: #fff;
                }

                /* Cart Item */
                .cart-item {
                    background: #1a1a1a;
                    border: 2px solid #2a2a2a;
                    border-radius: 16px;
                    padding: 2rem;
                    display: grid;
                    grid-template-columns: 150px 1fr auto auto auto;
                    gap: 2rem;
                    align-items: center;
                    transition: all 0.3s;
                }

                .cart-item:hover {
                    border-color: #D4AF37;
                }

                .cart-item.removing {
                    opacity: 0.5;
                    pointer-events: none;
                }

                .item-image {
                    width: 150px;
                    height: 150px;
                    background: #0F0F0F;
                    border-radius: 12px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: transform 0.3s;
                }

                .item-image:hover {
                    transform: scale(1.05);
                }

                .item-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .item-details {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .item-details h3 {
                    color: #fff;
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin: 0;
                    cursor: pointer;
                    transition: color 0.3s;
                }

                .item-details h3:hover {
                    color: #D4AF37;
                }

                .item-description {
                    color: #999;
                    font-size: 0.9rem;
                    margin: 0;
                    line-height: 1.5;
                }

                .item-stock {
                    margin-top: 0.5rem;
                }

                .in-stock,
                .out-stock {
                    font-size: 0.85rem;
                    font-weight: 600;
                    padding: 0.3rem 0.8rem;
                    border-radius: 12px;
                    display: inline-block;
                }

                .in-stock {
                    background: rgba(76, 175, 80, 0.15);
                    color: #4CAF50;
                    border: 1px solid rgba(76, 175, 80, 0.3);
                }

                .out-stock {
                    background: rgba(244, 67, 54, 0.15);
                    color: #f44336;
                    border: 1px solid rgba(244, 67, 54, 0.3);
                }

                .item-quantity {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    align-items: center;
                }

                .item-quantity label {
                    color: #999;
                    font-size: 0.85rem;
                    font-weight: 600;
                }

                .quantity-controls {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    background: #0F0F0F;
                    border: 2px solid #2a2a2a;
                    border-radius: 8px;
                    padding: 0.5rem 0.8rem;
                }

                .quantity-controls button {
                    width: 30px;
                    height: 30px;
                    background: #D4AF37;
                    border: none;
                    border-radius: 6px;
                    color: #0F0F0F;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                }

                .quantity-controls button:hover:not(:disabled) {
                    background: #F4D03F;
                    transform: scale(1.1);
                }

                .quantity-controls button:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }

                .quantity-controls span {
                    color: #fff;
                    font-size: 1.1rem;
                    font-weight: 700;
                    min-width: 35px;
                    text-align: center;
                }

                .item-price {
                    display: flex;
                    flex-direction: column;
                    gap: 0.3rem;
                    align-items: flex-end;
                    min-width: 100px;
                }

                .item-price .price {
                    color: #999;
                    font-size: 0.9rem;
                }

                .item-price .subtotal {
                    color: #D4AF37;
                    font-size: 1.5rem;
                    font-weight: 800;
                }

                .remove-btn {
                    width: 45px;
                    height: 45px;
                    background: rgba(244, 67, 54, 0.1);
                    border: 2px solid #f44336;
                    border-radius: 8px;
                    color: #f44336;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                }

                .remove-btn:hover:not(:disabled) {
                    background: #f44336;
                    color: #fff;
                    transform: scale(1.05);
                }

                .remove-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* Order Summary */
                .order-summary {
                    background: #1a1a1a;
                    border: 2px solid #2a2a2a;
                    border-radius: 16px;
                    padding: 2rem;
                    height: fit-content;
                    position: sticky;
                    top: 100px;
                }

                .order-summary h2 {
                    color: #fff;
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin: 0 0 1.5rem 0;
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    color: #999;
                    font-size: 0.95rem;
                }

                .summary-row span:last-child {
                    color: #fff;
                    font-weight: 600;
                }

                .summary-row.total {
                    font-size: 1.3rem;
                    font-weight: 800;
                    color: #fff;
                    margin-top: 1rem;
                }

                .summary-row.total span:last-child {
                    color: #D4AF37;
                    font-size: 1.8rem;
                }

                .summary-divider {
                    height: 1px;
                    background: #2a2a2a;
                    margin: 1.5rem 0;
                }

                .free-shipping-notice {
                    background: rgba(76, 175, 80, 0.15);
                    color: #4CAF50;
                    padding: 0.8rem;
                    border-radius: 8px;
                    text-align: center;
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    border: 1px solid rgba(76, 175, 80, 0.3);
                }

                .shipping-notice {
                    background: rgba(212, 175, 55, 0.15);
                    color: #D4AF37;
                    padding: 0.8rem;
                    border-radius: 8px;
                    text-align: center;
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    border: 1px solid rgba(212, 175, 55, 0.3);
                }

                .checkout-btn {
                    width: 100%;
                    padding: 1.3rem;
                    background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
                    border: none;
                    border-radius: 50px;
                    color: #0F0F0F;
                    font-family: 'Poppins', sans-serif;
                    font-weight: 900;
                    font-size: 1.2rem;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    margin-top: 1.5rem;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
                }

                .checkout-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                    transition: left 0.6s;
                }

                .checkout-btn:hover::before {
                    left: 100%;
                }

                .checkout-btn::after {
                    content: '→';
                    position: absolute;
                    right: 1.5rem;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 1.5rem;
                    font-weight: bold;
                    transition: all 0.3s;
                    opacity: 0;
                }

                .checkout-btn:hover::after {
                    right: 1.2rem;
                    opacity: 1;
                }

                .checkout-btn:hover {
                    transform: translateY(-3px) scale(1.01);
                    box-shadow: 0 15px 45px rgba(212, 175, 55, 0.6);
                    background: linear-gradient(135deg, #F4D03F 0%, #D4AF37 100%);
                }

                .checkout-btn:active {
                    transform: translateY(-1px) scale(0.99);
                }

                .payment-methods {
                    text-align: center;
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #2a2a2a;
                }

                .payment-methods p {
                    color: #999;
                    font-size: 0.85rem;
                    margin: 0 0 0.8rem 0;
                }

                .payment-icons {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    font-size: 1.8rem;
                }

                /* Responsive Design */
                @media (max-width: 1024px) {
                    .cart-container {
                        grid-template-columns: 1fr;
                        padding: 0 2rem;
                    }

                    .order-summary {
                        position: static;
                    }

                    .cart-item {
                        grid-template-columns: 120px 1fr;
                        grid-template-rows: auto auto auto;
                        gap: 1.5rem;
                    }

                    .item-image {
                        width: 120px;
                        height: 120px;
                        grid-row: 1 / 3;
                    }

                    .item-details {
                        grid-column: 2;
                    }

                    .item-quantity,
                    .item-price {
                        grid-column: 2;
                        flex-direction: row;
                        justify-content: space-between;
                    }

                    .remove-btn {
                        grid-column: 1 / 3;
                        width: 100%;
                        height: 45px;
                    }
                }

                @media (max-width: 768px) {
                    .cart-page {
                        padding-top: 80px;
                    }

                    .cart-header {
                        padding: 3rem 1.5rem;
                    }

                    .header-content h1 {
                        font-size: 2.5rem;
                    }

                    .cart-container {
                        padding: 0 1.5rem;
                        margin: 2rem auto;
                    }

                    .cart-actions {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .back-btn,
                    .clear-cart-btn {
                        width: 100%;
                        justify-content: center;
                    }

                    .cart-item {
                        padding: 1.5rem;
                        gap: 1rem;
                    }
                }

                @media (max-width: 480px) {
                    .cart-header {
                        padding: 2.5rem 1rem;
                    }

                    .header-content h1 {
                        font-size: 2rem;
                    }

                    .header-content p {
                        font-size: 1rem;
                    }

                    .cart-container {
                        padding: 0 1rem;
                    }

                    .cart-item {
                        grid-template-columns: 1fr;
                        padding: 1.2rem;
                    }

                    .item-image {
                        width: 100%;
                        height: 200px;
                        grid-row: auto;
                    }

                    .item-details {
                        grid-column: auto;
                    }

                    .item-quantity,
                    .item-price {
                        grid-column: auto;
                    }

                    .remove-btn {
                        grid-column: auto;
                    }

                    .order-summary {
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default CartPage;