// API Configuration
export const API_URL = 'http://localhost:3000/api';

export const ENDPOINTS = {
    // Auth (changed from /admin/login to /auth/login)
    LOGIN: '/auth/login',
    PROFILE: '/auth/me',

    // Dashboard
    STATS: '/admin/stats',

    // Products
    PRODUCTS: '/products',
    PRODUCT_BY_ID: (id) => `/products/${id}`,

    // Categories
    CATEGORIES: '/categories',
    CATEGORY_BY_ID: (id) => `/categories/${id}`,

    // Orders
    ORDERS: '/orders',
    ORDER_STATUS: (id) => `/orders/${id}/status`,

    // Admins
    ADMIN_USERS: '/admin/users',
    ADMIN_USER_BY_ID: (id) => `/admin/users/${id}`,

    FEATURED_PRODUCTS: '/products/featured',

    CART: '/cart',

    AUTH: '/auth',


};