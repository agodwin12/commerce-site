// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../utils/api';
import { ENDPOINTS } from '../utils/constants';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    // Generate or get session ID for guest users
    const getSessionId = () => {
        let sessionId = localStorage.getItem('cart_session_id');
        if (!sessionId) {
            sessionId = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now();
            localStorage.setItem('cart_session_id', sessionId);
        }
        return sessionId;
    };

    // Fetch cart from backend
    const fetchCart = async () => {
        try {
            setLoading(true);
            const sessionId = getSessionId();
            const response = await api.get(`${ENDPOINTS.CART}?session_id=${sessionId}`);

            if (response.success && response.data) {
                setCart(response.data.items || []);
                updateCartCount(response.data.items || []);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            // If backend fails, use local storage as fallback
            const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCart(localCart);
            updateCartCount(localCart);
        } finally {
            setLoading(false);
        }
    };

    // Update cart count
    const updateCartCount = (cartItems) => {
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCartCount(count);
    };

    // Add item to cart
    const addToCart = async (product) => {
        try {
            const sessionId = getSessionId();
            const response = await api.post(ENDPOINTS.CART + '/add', {
                session_id: sessionId,
                product_id: product.id,
                quantity: 1
            });

            if (response.success) {
                await fetchCart();
                return true;
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            // Fallback to local storage
            const existingItem = cart.find(item => item.product_id === product.id);
            let newCart;

            if (existingItem) {
                newCart = cart.map(item =>
                    item.product_id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                newCart = [...cart, {
                    id: Date.now(),
                    product_id: product.id,
                    quantity: 1,
                    product: product
                }];
            }

            setCart(newCart);
            updateCartCount(newCart);
            localStorage.setItem('cart', JSON.stringify(newCart));
            return true;
        }
    };

    // Update cart item quantity
    const updateCartItemQuantity = async (itemId, quantity) => {
        if (quantity < 1) {
            return removeFromCart(itemId);
        }

        try {
            const sessionId = getSessionId();
            const response = await api.put(`${ENDPOINTS.CART}/items/${itemId}`, {
                quantity: quantity,
                session_id: sessionId  // Add session_id
            });

            if (response.success) {
                await fetchCart();
                return true;
            }
        } catch (error) {
            console.error('Error updating cart item:', error);
            // Fallback to local storage
            const newCart = cart.map(item =>
                item.id === itemId ? { ...item, quantity: quantity } : item
            );
            setCart(newCart);
            updateCartCount(newCart);
            localStorage.setItem('cart', JSON.stringify(newCart));
            return true;
        }
    };


    // Remove item from cart
    const removeFromCart = async (itemId) => {
        try {
            const sessionId = getSessionId();
            const response = await api.delete(`${ENDPOINTS.CART}/items/${itemId}?session_id=${sessionId}`);  // Add session_id as query param

            if (response.success) {
                await fetchCart();
                return true;
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            // Fallback to local storage
            const newCart = cart.filter(item => item.id !== itemId);
            setCart(newCart);
            updateCartCount(newCart);
            localStorage.setItem('cart', JSON.stringify(newCart));
            return true;
        }
    };
    // Clear cart
    const clearCart = async () => {
        try {
            const sessionId = getSessionId();
            const response = await api.delete(`${ENDPOINTS.CART}/clear?session_id=${sessionId}`);  // Add session_id as query param

            if (response.success) {
                setCart([]);
                setCartCount(0);
                localStorage.removeItem('cart');
                return true;
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            // Fallback to local storage
            setCart([]);
            setCartCount(0);
            localStorage.removeItem('cart');
            return true;
        }
    };
    // Get cart total
    const getCartTotal = () => {
        return cart.reduce((total, item) => {
            const price = parseFloat(item.product?.price) || 0;
            const quantity = parseInt(item.quantity) || 0;
            return total + (price * quantity);
        }, 0);
    };

    // Load cart on mount
    useEffect(() => {
        fetchCart();
    }, []);

    const value = {
        cart,
        loading,
        cartCount,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        fetchCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;