// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import Shop from './pages/Shop';
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import TawkToChat from './components/TawkTo/TawkTo.jsx';
import ProductDetailsPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from "./components/Auth/LoginPage.jsx";
import AdminLayout from './components/Admins/AdminLayout';
import DashboardView from "./components/Dashboard/DashboardView.jsx";
import ProductsView from "./components/Products/ProductsView.jsx";
import './App.css';

// Protected Route Component for Admin
const ProtectedAdminRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'admin' && user.role !== 'super_admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Public Layout Component (with Navbar and Footer)
const PublicLayout = ({ children }) => {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
};

function App() {
    return (
        <CartProvider>
            <TawkToChat />
            <Router>
                <Routes>
                    {/* Login Page - No Layout */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/admin/login" element={<LoginPage />} />

                    {/* Admin Routes - Use AdminLayout (No Navbar/Footer) */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedAdminRoute>
                                <AdminLayout />
                            </ProtectedAdminRoute>
                        }
                    >
                        <Route index element={<Navigate to="/admin/products" replace />} />
                        <Route path="dashboard" element={<DashboardView />} />
                        <Route path="products" element={<ProductsView />} />
                        {/* Add more admin routes here as needed */}
                    </Route>

                    {/* Public Routes - Use PublicLayout (With Navbar/Footer) */}
                    <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
                    <Route path="/shop" element={<PublicLayout><Shop /></PublicLayout>} />
                    <Route path="/products" element={<PublicLayout><Shop /></PublicLayout>} />
                    <Route path="/categories" element={<PublicLayout><Shop /></PublicLayout>} />
                    <Route path="/product/:id" element={<PublicLayout><ProductDetailsPage /></PublicLayout>} />
                    <Route path="/about" element={<PublicLayout><AboutUs /></PublicLayout>} />
                    <Route path="/contact" element={<PublicLayout><ContactUs /></PublicLayout>} />
                    <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
                    <Route path="/checkout" element={<PublicLayout><CheckoutPage /></PublicLayout>} />

                    {/* Catch all - redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </CartProvider>
    );
}

export default App;