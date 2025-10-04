// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {CreditCard, Truck, MapPin, Phone, Mail, User, Lock, CheckCircle, Wallet} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../utils/api';
import { ENDPOINTS } from '../utils/constants';
import AnimatedText from '../components/common/AnimatedText';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal, clearCart } = useCart();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);

        try {
            // Get session ID for guest orders
            const getSessionId = () => {
                let sessionId = localStorage.getItem('cart_session_id');
                if (!sessionId) {
                    sessionId = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now();
                    localStorage.setItem('cart_session_id', sessionId);
                }
                return sessionId;
            };

            // Prepare order data matching backend expected format
            const orderData = {
                session_id: getSessionId(),  // Include session_id for guest orders
                shipping_first_name: formData.firstName,
                shipping_last_name: formData.lastName,
                shipping_email: formData.email,
                shipping_phone: formData.phone,
                shipping_address: formData.address,
                shipping_city: formData.city,
                shipping_state: formData.state,
                shipping_postal_code: formData.zipCode,
                shipping_country: formData.country,
                payment_method: paymentMethod,
                notes: ''
            };

            // Check if user is authenticated
            const token = localStorage.getItem('token');
            const endpoint = token ? ENDPOINTS.ORDERS : `${ENDPOINTS.ORDERS}/guest`;

            // Make API call to create order
            const response = await api.post(endpoint, orderData);

            if (response.success) {
                // Clear cart after successful order
                await clearCart();

                // Show success message with order ID
                alert(`Order placed successfully! Order ID: #${response.data.id}\n\nThank you for your purchase!`);

                // Navigate to home or order confirmation page
                navigate('/');
            } else {
                throw new Error(response.message || 'Failed to create order');
            }
        } catch (error) {
            console.error('Order creation error:', error);

            // Handle specific error cases
            if (error.response?.status === 400) {
                alert(error.response?.data?.message || 'Invalid order data. Please check your information.');
            } else if (error.message?.includes('stock')) {
                alert('Some items in your cart are out of stock. Please review your cart.');
                navigate('/cart');
            } else {
                alert('Failed to place order. Please try again.');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="checkout-page">
                <AnimatedText direction="top" delay={50}>
                    <div className="empty-checkout">
                        <CheckCircle size={80} />
                        <h2>Your cart is empty</h2>
                        <p>Add some items to your cart before checking out.</p>
                        <button className="shop-btn" onClick={() => navigate('/shop')}>
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
        <div className="checkout-page">
            {/* Page Header */}
            <AnimatedText direction="top" delay={50}>
                <div className="checkout-header">
                    <h1>Checkout</h1>
                    <p>Complete your order</p>
                </div>
            </AnimatedText>

            <div className="checkout-container">
                {/* Checkout Form */}
                <form className="checkout-form" onSubmit={handlePlaceOrder}>
                    {/* Shipping Information */}
                    <AnimatedText direction="left" delay={100}>
                        <div className="form-section">
                            <div className="section-header">
                                <Truck size={24} />
                                <h2>Shipping Information</h2>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>
                                        <User size={16} />
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className={errors.firstName ? 'error' : ''}
                                    />
                                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                                </div>

                                <div className="form-group">
                                    <label>
                                        <User size={16} />
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className={errors.lastName ? 'error' : ''}
                                    />
                                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                                </div>

                                <div className="form-group">
                                    <label>
                                        <Mail size={16} />
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={errors.email ? 'error' : ''}
                                    />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>

                                <div className="form-group">
                                    <label>
                                        <Phone size={16} />
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={errors.phone ? 'error' : ''}
                                    />
                                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                                </div>

                                <div className="form-group full-width">
                                    <label>
                                        <MapPin size={16} />
                                        Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className={errors.address ? 'error' : ''}
                                    />
                                    {errors.address && <span className="error-message">{errors.address}</span>}
                                </div>

                                <div className="form-group">
                                    <label>City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className={errors.city ? 'error' : ''}
                                    />
                                    {errors.city && <span className="error-message">{errors.city}</span>}
                                </div>

                                <div className="form-group">
                                    <label>State / Province *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className={errors.state ? 'error' : ''}
                                    />
                                    {errors.state && <span className="error-message">{errors.state}</span>}
                                </div>

                                <div className="form-group">
                                    <label>ZIP / Postal Code *</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        className={errors.zipCode ? 'error' : ''}
                                    />
                                    {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Country *</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className={errors.country ? 'error' : ''}
                                    />
                                    {errors.country && <span className="error-message">{errors.country}</span>}
                                </div>
                            </div>
                        </div>
                    </AnimatedText>

                    {/* Payment Method */}
                    <AnimatedText direction="left" delay={150}>
                        <div className="form-section">
                            <div className="section-header">
                                <CreditCard size={24} />
                                <h2>Payment Method</h2>
                            </div>

                            <div className="payment-methods">
                                <div
                                    className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('card')}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={() => setPaymentMethod('card')}
                                    />
                                    <div className="payment-info">
                                        <CreditCard size={20} />
                                        <span>Credit / Debit Card</span>
                                    </div>
                                </div>

                                <div
                                    className={`payment-option ${paymentMethod === 'paypal' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('paypal')}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="paypal"
                                        checked={paymentMethod === 'paypal'}
                                        onChange={() => setPaymentMethod('paypal')}
                                    />
                                    <div className="payment-info">
                                        <div className="paypal-icon">PP</div>
                                        <span>PayPal</span>
                                    </div>
                                </div>

                                <div
                                    className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('cod')}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                    />
                                    <div className="payment-info">
                                        <Wallet  size={20} />
                                        <span>cashApp / Zelle/ Venmo</span>
                                    </div>
                                </div>
                            </div>

                            <div className="security-notice">
                                <Lock size={16} />
                                <span>Your payment information is secure and encrypted</span>
                            </div>
                        </div>
                    </AnimatedText>
                </form>

                {/* Order Summary */}
                <AnimatedText direction="right" delay={100}>
                    <div className="order-summary">
                        <h2>Order Summary</h2>

                        <div className="summary-items">
                            {cart.map((item) => (
                                <div key={item.id} className="summary-item">
                                    <div className="item-details">
                                        <span className="item-name">{item.product?.name}</span>
                                        <span className="item-quantity">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="item-price">
                                        ${((parseFloat(item.product?.price) || 0) * (parseInt(item.quantity) || 0)).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                        </div>

                        <div className="summary-row">
                            <span>Tax (10%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <button
                            className="place-order-btn"
                            onClick={handlePlaceOrder}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="button-spinner"></div>
                                    Processing...
                                </>
                            ) : (
                                'Place Order'
                            )}
                        </button>

                        <button
                            className="back-to-cart-btn"
                            onClick={() => navigate('/cart')}
                            type="button"
                        >
                            Back to Cart
                        </button>
                    </div>
                </AnimatedText>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

                * {
                    box-sizing: border-box;
                }

                .checkout-page {
                    width: 100%;
                    min-height: 100vh;
                    background: #0F0F0F;
                    padding-top: 100px;
                    padding-bottom: 4rem;
                    font-family: 'Poppins', sans-serif;
                }

                .checkout-header {
                    background: linear-gradient(135deg, #1a1a1a 0%, #0F0F0F 100%);
                    padding: 4rem 3rem;
                    border-bottom: 1px solid #2a2a2a;
                    text-align: center;
                }

                .checkout-header h1 {
                    font-size: 3rem;
                    font-weight: 900;
                    color: #D4AF37;
                    margin: 0 0 1rem 0;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                }

                .checkout-header p {
                    color: #999;
                    font-size: 1.1rem;
                    margin: 0;
                }

                .empty-checkout {
                    text-align: center;
                    padding: 6rem 2rem;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .empty-checkout svg {
                    color: #D4AF37;
                    margin-bottom: 2rem;
                }

                .empty-checkout h2 {
                    color: #fff;
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                }

                .empty-checkout p {
                    color: #999;
                    font-size: 1.1rem;
                    margin-bottom: 2rem;
                }

                .shop-btn {
                    padding: 1rem 2.5rem;
                    background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
                    border: none;
                    border-radius: 50px;
                    color: #0F0F0F;
                    font-family: 'Poppins', sans-serif;
                    font-weight: 700;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .shop-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
                }

                .checkout-container {
                    max-width: 1400px;
                    margin: 3rem auto;
                    padding: 0 3rem;
                    display: grid;
                    grid-template-columns: 1fr 400px;
                    gap: 3rem;
                }

                .checkout-form {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .form-section {
                    background: #1a1a1a;
                    border: 2px solid #2a2a2a;
                    border-radius: 16px;
                    padding: 2rem;
                }

                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid #2a2a2a;
                }

                .section-header svg {
                    color: #D4AF37;
                }

                .section-header h2 {
                    color: #fff;
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 0;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-group.full-width {
                    grid-column: 1 / -1;
                }

                .form-group label {
                    color: #fff;
                    font-size: 0.9rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .form-group label svg {
                    color: #D4AF37;
                }

                .form-group input {
                    padding: 0.9rem 1.2rem;
                    background: #0F0F0F;
                    border: 2px solid #2a2a2a;
                    border-radius: 12px;
                    color: #fff;
                    font-family: 'Poppins', sans-serif;
                    font-size: 0.95rem;
                    transition: all 0.3s;
                }

                .form-group input:focus {
                    outline: none;
                    border-color: #D4AF37;
                    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
                }

                .form-group input.error {
                    border-color: #f44336;
                }

                .error-message {
                    color: #f44336;
                    font-size: 0.8rem;
                    margin-top: -0.3rem;
                }

                .payment-methods {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .payment-option {
                    padding: 1.2rem;
                    background: #0F0F0F;
                    border: 2px solid #2a2a2a;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .payment-option:hover {
                    border-color: #D4AF37;
                    background: rgba(212, 175, 55, 0.05);
                }

                .payment-option.active {
                    border-color: #D4AF37;
                    background: rgba(212, 175, 55, 0.1);
                }

                .payment-option input[type="radio"] {
                    width: 20px;
                    height: 20px;
                    accent-color: #D4AF37;
                    cursor: pointer;
                }

                .payment-info {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    color: #fff;
                    font-weight: 600;
                }

                .payment-info svg {
                    color: #D4AF37;
                }

                .paypal-icon {
                    width: 20px;
                    height: 20px;
                    background: #D4AF37;
                    color: #0F0F0F;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 900;
                    font-size: 0.7rem;
                }

                .security-notice {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    margin-top: 1.5rem;
                    padding: 1rem;
                    background: rgba(76, 175, 80, 0.1);
                    border: 1px solid rgba(76, 175, 80, 0.3);
                    border-radius: 12px;
                    color: #4CAF50;
                    font-size: 0.85rem;
                }

                .security-notice svg {
                    flex-shrink: 0;
                }

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

                .summary-items {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .summary-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: 1rem;
                    background: #0F0F0F;
                    border-radius: 8px;
                }

                .item-details {
                    display: flex;
                    flex-direction: column;
                    gap: 0.3rem;
                }

                .item-name {
                    color: #fff;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .item-quantity {
                    color: #999;
                    font-size: 0.8rem;
                }

                .item-price {
                    color: #D4AF37;
                    font-weight: 700;
                    font-size: 0.95rem;
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

                .place-order-btn {
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
                    transition: all 0.4s;
                    margin-top: 1.5rem;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.8rem;
                }

                .place-order-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                    transition: left 0.6s;
                }

                .place-order-btn:hover::before {
                    left: 100%;
                }

                .place-order-btn:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 45px rgba(212, 175, 55, 0.6);
                }

                .place-order-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .button-spinner {
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(15, 15, 15, 0.3);
                    border-top-color: #0F0F0F;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .back-to-cart-btn {
                    width: 100%;
                    padding: 1rem;
                    background: rgba(212, 175, 55, 0.1);
                    border: 1px solid #D4AF37;
                    border-radius: 25px;
                    color: #D4AF37;
                    font-family: 'Poppins', sans-serif;
                    font-weight: 600;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-top: 1rem;
                }

                .back-to-cart-btn:hover {
                    background: #D4AF37;
                    color: #0F0F0F;
                }

                /* Responsive Design */
                @media (max-width: 1024px) {
                    .checkout-container {
                        grid-template-columns: 1fr;
                        padding: 0 2rem;
                    }

                    .order-summary {
                        position: static;
                    }
                }

                @media (max-width: 768px) {
                    .checkout-page {
                        padding-top: 80px;
                    }

                    .checkout-header {
                        padding: 3rem 1.5rem;
                    }

                    .checkout-header h1 {
                        font-size: 2.5rem;
                    }

                    .checkout-container {
                        padding: 0 1.5rem;
                        margin: 2rem auto;
                    }

                    .form-grid {
                        grid-template-columns: 1fr;
                    }

                    .form-section {
                        padding: 1.5rem;
                    }
                }

                @media (max-width: 480px) {
                    .checkout-header {
                        padding: 2.5rem 1rem;
                    }

                    .checkout-header h1 {
                        font-size: 2rem;
                    }

                    .checkout-container {
                        padding: 0 1rem;
                    }

                    .form-section {
                        padding: 1.2rem;
                    }

                    .order-summary {
                        padding: 1.5rem;
                    }

                    .place-order-btn {
                        font-size: 1.1rem;
                        padding: 1.2rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default CheckoutPage;