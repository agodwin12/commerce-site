import React, { useState, useEffect } from 'react';
import { X, Home, Package, Grid, Info, Phone, User, ChevronRight, ChevronDown } from 'lucide-react';
import { api } from '../../utils/api';
import { ENDPOINTS } from '../../utils/constants';

const MobileSidebar = ({ isOpen, onClose }) => {
    const [showCategories, setShowCategories] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    const menuItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Package, label: 'Products', path: '/shop' },
        { icon: Info, label: 'About', path: '/about' },
        { icon: Phone, label: 'Contact', path: '/contact' },
        { icon: User, label: 'My Account', path: '/account' },
    ];

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

        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const handleCategoryToggle = () => {
        setShowCategories(!showCategories);
    };

    return (
        <>
            <div
                className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            />

            <div className={`mobile-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="header-content">
                        <h2>Powersynth Labs<span className="gold">+</span></h2>
                        <p>Your Health Partner</p>
                    </div>
                    <button className="close-btn" onClick={onClose} aria-label="Close menu">
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item, index) => (
                        <a
                            key={index}
                            href={item.path}
                            className="sidebar-link"
                            onClick={onClose}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="link-icon">
                                <item.icon size={18} />
                            </div>
                            <span className="link-label">{item.label}</span>
                            <ChevronRight size={16} className="link-arrow" />
                        </a>
                    ))}

                    {/* Categories Dropdown */}
                    <div
                        className="sidebar-link categories-link"
                        onClick={handleCategoryToggle}
                        style={{ animationDelay: '0.25s' }}
                    >
                        <div className="link-icon">
                            <Grid size={18} />
                        </div>
                        <span className="link-label">Categories</span>
                        <ChevronDown
                            size={16}
                            className={`category-chevron ${showCategories ? 'rotated' : ''}`}
                        />
                    </div>

                    {/* Category Items */}
                    <div className={`category-dropdown ${showCategories ? 'open' : ''}`}>
                        {categoriesLoading ? (
                            <div className="category-loading">
                                <div className="loading-spinner"></div>
                                <span>Loading...</span>
                            </div>
                        ) : categories.length > 0 ? (
                            categories.map((category, index) => (
                                <a
                                    key={category.id || category._id || index}
                                    href={`/shop/category/${category.slug || category.id || category._id}`}
                                    className="category-item"
                                    onClick={onClose}
                                    style={{ animationDelay: `${index * 0.03}s` }}
                                >
                                    <div className="category-dot"></div>
                                    <span>{category.name}</span>
                                </a>
                            ))
                        ) : (
                            <div className="category-empty">
                                <span>No categories available</span>
                            </div>
                        )}
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="footer-content">
                        <p className="footer-text">Powersynth Labs+ &copy; 2025</p>
                        <p className="footer-tagline">Quality Healthcare Products</p>
                    </div>
                </div>

                <div className="sidebar-glow"></div>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          background: #0a0a0a;
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          z-index: 1998;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .mobile-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 280px;
          max-width: 80vw;
          background: rgba(15, 15, 15, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-right: 2px solid #D4AF37;
          box-shadow: 5px 0 50px rgba(0, 0, 0, 0.5);
          z-index: 1999;
          display: flex;
          flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .mobile-sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(180deg, #D4AF37, transparent, #D4AF37);
          animation: borderGlow 3s ease-in-out infinite;
        }

        @keyframes borderGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .mobile-sidebar.open {
          transform: translateX(0);
        }

        .sidebar-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%);
          pointer-events: none;
          animation: glowPulse 4s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 1rem;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          background: rgba(26, 26, 26, 0.3);
          position: relative;
          z-index: 2;
          flex-shrink: 0;
        }

        .header-content {
          flex: 1;
        }

        .header-content h2 {
          color: #fff;
          font-size: 1.5rem;
          font-family: 'Poppins', sans-serif;
          font-weight: 800;
          margin: 0 0 0.2rem 0;
          letter-spacing: 0.5px;
        }

        .header-content .gold {
          color: #D4AF37;
          display: inline-block;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        .header-content p {
          color: #999;
          font-size: 0.75rem;
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
          margin: 0;
          letter-spacing: 0.3px;
        }

        .close-btn {
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 50%;
          color: #D4AF37;
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 38px;
          height: 38px;
          flex-shrink: 0;
        }

        .close-btn:hover {
          background: #D4AF37;
          color: #0F0F0F;
          border-color: #D4AF37;
          transform: rotate(90deg);
          box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem 0;
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
          z-index: 2;
        }

        .sidebar-nav::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-nav::-webkit-scrollbar-track {
          background: rgba(26, 26, 26, 0.5);
        }

        .sidebar-nav::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 2px;
        }

        .sidebar-nav::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem;
          color: #fff;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border-left: 3px solid transparent;
          position: relative;
          overflow: hidden;
          font-family: 'Poppins', sans-serif;
          font-weight: 500;
          font-size: 0.9rem;
          opacity: 0;
          transform: translateX(-20px);
          cursor: pointer;
        }

        .mobile-sidebar.open .sidebar-link {
          animation: slideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .sidebar-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 100%;
          background: linear-gradient(90deg, rgba(212, 175, 55, 0.15), transparent);
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar-link:hover::before {
          width: 100%;
        }

        .sidebar-link:hover {
          background: rgba(212, 175, 55, 0.05);
          border-left-color: #D4AF37;
          color: #D4AF37;
          padding-left: 1.5rem;
          box-shadow: inset 0 0 20px rgba(212, 175, 55, 0.1);
        }

        .categories-link {
          cursor: pointer;
        }

        .link-icon {
          width: 36px;
          height: 36px;
          background: rgba(26, 26, 26, 0.6);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }

        .sidebar-link:hover .link-icon {
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          border-color: #D4AF37;
          color: #0F0F0F;
          transform: rotate(360deg) scale(1.1);
          box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
        }

        .link-label {
          flex: 1;
          white-space: nowrap;
        }

        .link-arrow {
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }

        .sidebar-link:hover .link-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .category-chevron {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }

        .category-chevron.rotated {
          transform: rotate(180deg);
        }

        .category-dropdown {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(10, 10, 10, 0.5);
        }

        .category-dropdown.open {
          max-height: 500px;
        }

        .category-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          padding: 1.5rem;
          color: #999;
          font-family: 'Poppins', sans-serif;
          font-size: 0.8rem;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-top-color: #D4AF37;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .category-empty {
          padding: 1.5rem;
          text-align: center;
          color: #999;
          font-family: 'Poppins', sans-serif;
          font-size: 0.8rem;
        }

        .category-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.9rem 1rem 0.9rem 2.5rem;
          color: #ccc;
          text-decoration: none;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
          font-weight: 400;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          opacity: 0;
          transform: translateX(-20px);
        }

        .category-dropdown.open .category-item {
          animation: categorySlide 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes categorySlide {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .category-item:hover {
          color: #D4AF37;
          background: rgba(212, 175, 55, 0.05);
          padding-left: 3rem;
        }

        .category-dot {
          width: 6px;
          height: 6px;
          background: rgba(212, 175, 55, 0.5);
          border-radius: 50%;
          flex-shrink: 0;
          transition: all 0.3s;
        }

        .category-item:hover .category-dot {
          background: #D4AF37;
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.6);
          transform: scale(1.5);
        }

        .sidebar-footer {
          padding: 1.2rem 1rem;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
          background: rgba(26, 26, 26, 0.3);
          position: relative;
          z-index: 2;
          flex-shrink: 0;
        }

        .footer-content {
          text-align: center;
        }

        .footer-text {
          color: #999;
          font-size: 0.8rem;
          font-family: 'Poppins', sans-serif;
          font-weight: 500;
          margin: 0 0 0.2rem 0;
          letter-spacing: 0.3px;
        }

        .footer-tagline {
          color: #666;
          font-size: 0.7rem;
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
          margin: 0;
          letter-spacing: 0.3px;
        }

        @media (min-width: 969px) {
          .mobile-sidebar,
          .sidebar-overlay {
            display: none;
          }
        }

        @media (max-width: 375px) {
          .mobile-sidebar {
            width: 260px;
            max-width: 85vw;
          }

          .sidebar-header {
            padding: 1.2rem 0.8rem;
          }

          .header-content h2 {
            font-size: 1.3rem;
          }

          .header-content p {
            font-size: 0.7rem;
          }

          .close-btn {
            width: 34px;
            height: 34px;
            padding: 0.4rem;
          }

          .sidebar-link {
            padding: 0.9rem 0.8rem;
            font-size: 0.85rem;
            gap: 0.7rem;
          }

          .link-icon {
            width: 32px;
            height: 32px;
          }

          .link-icon svg {
            width: 16px;
            height: 16px;
          }

          .category-item {
            padding: 0.8rem 0.8rem 0.8rem 2rem;
            font-size: 0.8rem;
          }

          .sidebar-footer {
            padding: 1rem 0.8rem;
          }

          .footer-text {
            font-size: 0.75rem;
          }

          .footer-tagline {
            font-size: 0.65rem;
          }
        }

        @media (max-width: 320px) {
          .mobile-sidebar {
            width: 240px;
            max-width: 90vw;
          }

          .header-content h2 {
            font-size: 1.2rem;
          }

          .sidebar-link {
            padding: 0.8rem;
            font-size: 0.8rem;
          }

          .category-item {
            padding: 0.7rem 0.7rem 0.7rem 1.8rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
        </>
    );
};

export default MobileSidebar;