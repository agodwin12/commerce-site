// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import Shop from './pages/Shop';
import './App.css';
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import TawkToChat from './components/TawkTo/TawkTo.jsx';


function App() {
    return (
        <CartProvider>
            <TawkToChat />
            <Router>
                <Navbar />
                <Routes>

                    {/* Home Page */}
                    <Route path="/" element={<HomePage />} />

                    {/* Shop/Products Pages */}
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/products" element={<Shop />} />
                    <Route path="/categories" element={<Shop />} />

                    {/* Admin Login - You'll create this component next */}
                    <Route path="/admin/login" element={<div>Admin Login Page</div>} />

                    {/* Add more routes as needed */}
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<ContactUs />} />
                </Routes>
                <Footer />
            </Router>
        </CartProvider>
    );
}

export default App;