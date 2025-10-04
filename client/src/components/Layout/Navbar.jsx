import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, ChevronDown, LogOut } from 'lucide-react';
import { api } from '../../utils/api';
import { ENDPOINTS } from '../../utils/constants';
import { useCart } from '../../context/CartContext';
import MobileSidebar from './MobileSidebar';

const Navbar = () => {
    const navigate = useNavigate();
    const { cartCount } = useCart();
    const [showSidebar, setShowSidebar] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = () => {
            try {
                const token = localStorage.getItem('adminToken');
                const userStr = localStorage.getItem('user');

                if (token && userStr) {
                    const user = JSON.parse(userStr);
                    setCurrentUser(user);
                } else {
                    setCurrentUser(null);
                }
            } catch (error) {
                console.error('Error loading user:', error);
                setCurrentUser(null);
            }
        };

        loadUser();

        const handleStorageChange = () => {
            loadUser();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                const response = await api.get(ENDPOINTS.CATEGORIES);

                if (response.success && response.data) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/shop?category=${categoryId}`);
        setShowDropdown(false);
    };

    const handleUserIconClick = () => {
        if (currentUser) {
            setShowUserMenu(!showUserMenu);
        } else {
            navigate('/login');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('user');
        setCurrentUser(null);
        setShowUserMenu(false);
        navigate('/');
    };

    const handleProfileClick = () => {
        if (currentUser && currentUser.role === 'admin') {
            navigate('/admin/dashboard');
        } else {
            navigate('/profile');
        }
        setShowUserMenu(false);
    };

    return (
        <>
            <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    <button
                        className="menu-toggle"
                        onClick={() => setShowSidebar(true)}
                        aria-label="Open menu"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="logo" onClick={() => navigate('/')}>
                        <h1>
                            Powersynth Labs<span className="gold">+</span>
                        </h1>
                        <div className="logo-glow"></div>
                        <div className="logo-underline"></div>
                    </div>

                    <div className="nav-links desktop-only">
                        <div className="nav-link" onClick={() => navigate('/')}>
                            <span>Home</span>
                        </div>
                        <div className="nav-link" onClick={() => navigate('/shop')}>
                            <span>Products</span>
                        </div>
                        <div
                            className="nav-link dropdown"
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}
                        >
                            <span>Categories</span>
                            <ChevronDown size={16} className={`dropdown-icon ${showDropdown ? 'rotated' : ''}`} />

                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-content">
                                        {categoriesLoading ? (
                                            <div className="dropdown-loading">
                                                <div className="loading-spinner"></div>
                                                <span>Loading categories...</span>
                                            </div>
                                        ) : categories.length > 0 ? (
                                            categories.map((category, index) => (
                                                <div
                                                    key={category.id || category._id || index}
                                                    className="dropdown-item"
                                                    onClick={() => handleCategoryClick(category.id)}
                                                >
                                                    <span>{category.name}</span>
                                                    <div className="item-glow"></div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="dropdown-empty">
                                                <span>No categories available</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="nav-link" onClick={() => navigate('/about')}>
                            <span>About</span>
                        </div>
                        <div className="nav-link" onClick={() => navigate('/contact')}>
                            <span>Contact</span>
                        </div>
                    </div>

                    <div className="nav-actions">
                        <div className={`search-container desktop-only ${isSearchExpanded ? 'expanded' : ''}`}>
                            <div className="search-form">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchExpanded(true)}
                                    onBlur={() => setIsSearchExpanded(false)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button type="button" onClick={handleSearch} aria-label="Search">
                                    <Search size={18} />
                                </button>
                            </div>
                        </div>

                        <button
                            className="icon-btn mobile-search"
                            aria-label="Search"
                            onClick={() => navigate('/shop')}
                        >
                            <Search size={20} />
                        </button>

                        <div className="user-menu-container">
                            <button
                                className="icon-btn"
                                aria-label="User account"
                                onClick={handleUserIconClick}
                            >
                                <User size={20} />
                                <span className="icon-label">
                                    {currentUser ? currentUser.name?.split(' ')[0] || 'Account' : 'Login'}
                                </span>
                            </button>

                            {showUserMenu && currentUser && (
                                <div className="user-dropdown">
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            <User size={24} />
                                        </div>
                                        <div className="user-details">
                                            <div className="user-name">{currentUser.name}</div>
                                            <div className="user-email">{currentUser.email}</div>
                                        </div>
                                    </div>

                                    <div className="dropdown-divider"></div>

                                    <button className="dropdown-btn" onClick={handleProfileClick}>
                                        <User size={16} />
                                        {currentUser.role === 'admin' ? 'Admin Dashboard' : 'My Profile'}
                                    </button>

                                    <button className="dropdown-btn" onClick={() => {
                                        navigate('/orders');
                                        setShowUserMenu(false);
                                    }}>
                                        <ShoppingCart size={16} />
                                        My Orders
                                    </button>

                                    <div className="dropdown-divider"></div>

                                    <button className="dropdown-btn logout" onClick={handleLogout}>
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            className="icon-btn cart-btn"
                            aria-label="Shopping cart"
                            onClick={() => navigate('/cart')}
                        >
                            <ShoppingCart size={20} />
                            <span className="icon-label">Cart</span>
                            {cartCount > 0 && (
                                <span className="cart-badge">{cartCount}</span>
                            )}
                        </button>
                    </div>
                </div>

                <div className="navbar-glow"></div>
            </nav>

            {showUserMenu && (
                <div
                    className="overlay"
                    onClick={() => setShowUserMenu(false)}
                ></div>
            )}

            <MobileSidebar
                isOpen={showSidebar}
                onClose={() => setShowSidebar(false)}
            />

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Quintessential&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          background: #0a0a0a;
          min-height: 200vh;
        }

        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(15, 15, 15, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          z-index: 1000;
          padding: 1rem 0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }

        .navbar.scrolled {
          background: rgba(15, 15, 15, 0.95);
          padding: 0.7rem 0;
          border-bottom: 1px solid rgba(212, 175, 55, 0.3);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
        }

        .navbar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #D4AF37, transparent);
          opacity: 0.5;
        }

        .navbar-glow {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          width: 300px;
          height: 30px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%);
          filter: blur(20px);
          opacity: 0;
          transition: opacity 0.4s;
        }

        .navbar.scrolled .navbar-glow {
          opacity: 1;
        }

        .nav-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 3rem;
        }

        .menu-toggle {
          display: none;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 10px;
          color: #D4AF37;
          cursor: pointer;
          padding: 0.6rem;
          transition: all 0.3s;
        }

        .menu-toggle:hover {
          background: rgba(212, 175, 55, 0.2);
          border-color: #D4AF37;
          transform: scale(1.05);
        }

        .logo {
          position: relative;
          cursor: pointer;
          text-decoration: none;
          padding: 0.5rem 0;
        }

        .logo h1 {
          font-family: 'Quintessential', cursive;
          font-size: 2rem;
          font-weight: 400;
          color: #fff;
          margin: 0;
          letter-spacing: 2px;
          position: relative;
          z-index: 2;
          background: linear-gradient(135deg, #fff 0%, #D4AF37 50%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: logoShine 4s ease-in-out infinite;
          filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.3));
          transition: all 0.3s ease;
        }

        @keyframes logoShine {
          0%, 100% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
        }

        .logo:hover h1 {
          transform: translateY(-2px);
          filter: drop-shadow(0 0 30px rgba(212, 175, 55, 0.6));
          animation: logoShine 2s ease-in-out infinite, logoFloat 3s ease-in-out infinite;
        }

        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(-2px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .logo .gold {
          color: #D4AF37;
          display: inline-block;
          animation: plusPulse 2s ease-in-out infinite;
          font-weight: 700;
          text-shadow: 0 0 20px rgba(212, 175, 55, 0.8),
                       0 0 40px rgba(212, 175, 55, 0.4);
        }

        @keyframes plusPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.15) rotate(90deg);
          }
        }

        .logo-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 150%;
          height: 150%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%);
          filter: blur(20px);
          opacity: 0;
          transition: opacity 0.4s;
          animation: glowPulse 3s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }

        .logo:hover .logo-glow {
          opacity: 1;
          animation: glowPulse 1.5s ease-in-out infinite;
        }

        .logo-underline {
          height: 2px;
          background: linear-gradient(90deg, transparent, #D4AF37, transparent);
          margin-top: 4px;
          transform: scaleX(0);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }

        .logo:hover .logo-underline {
          transform: scaleX(1);
          animation: underlineGlow 1.5s ease-in-out infinite;
        }

        @keyframes underlineGlow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.8);
          }
        }

        .nav-links {
          display: flex;
          gap: 2.5rem;
          align-items: center;
        }

        .nav-link {
          color: #fff;
          text-decoration: none;
          font-family: 'Poppins', sans-serif;
          font-weight: 500;
          font-size: 0.95rem;
          position: relative;
          padding: 0.5rem 0;
          transition: color 0.3s;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .nav-link span {
          position: relative;
          z-index: 1;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #D4AF37, transparent);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-link:hover {
          color: #D4AF37;
        }

        .nav-link:hover::before {
          transform: translateX(-50%) scaleX(1);
        }

        .dropdown {
          position: relative;
        }

        .dropdown-icon {
          transition: transform 0.3s;
        }

        .dropdown-icon.rotated {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 1rem);
          left: 50%;
          transform: translateX(-50%);
          min-width: 280px;
          max-height: 400px;
          overflow-y: auto;
          background: rgba(20, 20, 20, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          padding: 0.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 
                      0 0 0 1px rgba(212, 175, 55, 0.1) inset;
          animation: dropdownSlide 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 100;
        }

        .dropdown-menu::-webkit-scrollbar {
          width: 6px;
        }

        .dropdown-menu::-webkit-scrollbar-track {
          background: rgba(26, 26, 26, 0.5);
          border-radius: 3px;
        }

        .dropdown-menu::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 3px;
        }

        .dropdown-menu::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }

        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .dropdown-menu::before {
          content: '';
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 8px solid rgba(212, 175, 55, 0.3);
        }

        .dropdown-menu::after {
          content: '';
          position: absolute;
          top: -7px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-bottom: 7px solid rgba(20, 20, 20, 0.98);
        }

        .dropdown-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .dropdown-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          gap: 1rem;
          color: #999;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
        }

        .loading-spinner {
          width: 30px;
          height: 30px;
          border: 3px solid rgba(212, 175, 55, 0.2);
          border-top-color: #D4AF37;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .dropdown-empty {
          padding: 2rem 1rem;
          text-align: center;
          color: #999;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
        }

        .dropdown-item {
          position: relative;
          padding: 0.9rem 1.2rem;
          color: #fff;
          text-decoration: none;
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .dropdown-item span {
          position: relative;
          z-index: 2;
        }

        .item-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .dropdown-item:hover {
          color: #D4AF37;
          transform: translateX(5px);
          background: rgba(212, 175, 55, 0.05);
        }

        .dropdown-item:hover .item-glow {
          opacity: 1;
        }

        .dropdown-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 0;
          background: linear-gradient(180deg, #D4AF37, #F4D03F);
          transition: height 0.3s;
          border-radius: 0 3px 3px 0;
        }

        .dropdown-item:hover::before {
          height: 70%;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .search-container {
          position: relative;
        }

        .search-form {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-form input {
          padding: 0.75rem 3rem 0.75rem 1.2rem;
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-radius: 50px;
          background: rgba(26, 26, 26, 0.6);
          backdrop-filter: blur(10px);
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
          width: 250px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .search-form input::placeholder {
          color: #999;
        }

        .search-form input:focus {
          outline: none;
          border-color: #D4AF37;
          background: rgba(26, 26, 26, 0.9);
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.2);
          width: 320px;
        }

        .search-container.expanded .search-form input {
          width: 320px;
        }

        .search-form button {
          position: absolute;
          right: 0.5rem;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          border: none;
          border-radius: 50%;
          color: #0F0F0F;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          transition: all 0.3s;
          width: 36px;
          height: 36px;
        }

        .search-form button:hover {
          transform: scale(1.1);
          box-shadow: 0 5px 15px rgba(212, 175, 55, 0.4);
        }

        .user-menu-container {
          position: relative;
        }

        .icon-btn {
          background: rgba(26, 26, 26, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          color: #fff;
          cursor: pointer;
          padding: 0.7rem 1rem;
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .icon-btn:hover {
          background: rgba(212, 175, 55, 0.1);
          border-color: #D4AF37;
          color: #D4AF37;
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(212, 175, 55, 0.2);
        }

        .icon-label {
          display: inline;
        }

        .mobile-search {
          display: none;
          padding: 0.7rem;
        }

        .user-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          min-width: 280px;
          background: rgba(20, 20, 20, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          padding: 1rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          animation: dropdownSlide 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1001;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem;
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0F0F0F;
          flex-shrink: 0;
        }

        .user-details {
          flex: 1;
          overflow: hidden;
        }

        .user-name {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          color: #fff;
          margin-bottom: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-family: 'Poppins', sans-serif;
          font-size: 0.8rem;
          color: #999;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dropdown-divider {
          height: 1px;
          background: rgba(212, 175, 55, 0.2);
          margin: 0.75rem 0;
        }

        .dropdown-btn {
          width: 100%;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.3s;
          text-align: left;
        }

        .dropdown-btn:hover {
          background: rgba(212, 175, 55, 0.1);
          color: #D4AF37;
          transform: translateX(5px);
        }

        .dropdown-btn.logout {
          color: #ff4444;
        }

        .dropdown-btn.logout:hover {
          background: rgba(255, 68, 68, 0.1);
          color: #ff4444;
        }

        .overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: transparent;
        }

        .cart-btn {
          position: relative;
        }

        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          color: #0F0F0F;
          font-size: 0.7rem;
          font-weight: 800;
          font-family: 'Poppins', sans-serif;
          padding: 0.25rem 0.5rem;
          border-radius: 50%;
          min-width: 20px;
          text-align: center;
          box-shadow: 0 3px 10px rgba(212, 175, 55, 0.4);
          animation: badgePop 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes badgePop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .cart-btn:hover .cart-badge {
          animation: shake 0.5s;
        }

        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }

        @media (max-width: 1200px) {
          .nav-container {
            padding: 0 2rem;
          }

          .nav-links {
            gap: 2rem;
          }
        }

        @media (max-width: 968px) {
          .desktop-only {
            display: none !important;
          }

          .menu-toggle {
            display: block;
          }

          .mobile-search {
            display: flex;
          }

          .nav-container {
            padding: 0 1.5rem;
            gap: 1rem;
          }

          .logo h1 {
            font-size: 1.6rem;
          }

          .icon-label {
            display: none;
          }

          .icon-btn {
            padding: 0.7rem;
          }

          .nav-actions {
            gap: 0.7rem;
          }

          .user-dropdown {
            right: 0;
            min-width: 260px;
          }
        }

        @media (max-width: 480px) {
          .nav-container {
            padding: 0 1rem;
          }

          .logo h1 {
            font-size: 1.4rem;
          }

          .icon-btn {
            padding: 0.6rem;
          }

          .icon-btn svg {
            width: 18px;
            height: 18px;
          }

          .nav-actions {
            gap: 0.5rem;
          }

          .user-dropdown {
            min-width: 240px;
          }
        }
      `}</style>
        </>
    );
};

export default Navbar;