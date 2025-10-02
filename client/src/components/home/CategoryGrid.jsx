// src/components/home/CategoryGrid.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { ENDPOINTS } from '../../utils/constants';
import AnimatedText from '../common/AnimatedText';

const CategoryGrid = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            console.log('Fetching categories...');
            const response = await api.get(ENDPOINTS.CATEGORIES);
            console.log('Categories response:', response);

            if (response.success && response.data) {
                // Limit to 3 categories maximum
                setCategories(response.data.slice(0, 3));
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryImage = (category) => {
        // If category has an image_url from backend, use it
        if (category.image_url) {
            return `http://localhost:3000${category.image_url}`;
        }
        // Fallback placeholder
        return 'https://via.placeholder.com/600x400?text=Category';
    };

    if (loading) {
        return (
            <section className="category-section">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading categories...</p>
                </div>
                <style>{`
          .category-section {
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
        <section className="category-section" id="categories">
            <div className="section-container">
                <AnimatedText direction="top" delay={100}>
                    <div className="section-header">
                        <div className="header-line"></div>
                        <h2>SHOP BY CATEGORY</h2>
                        <p>Browse our comprehensive range of pharmaceutical products</p>
                        <div className="header-underline"></div>
                    </div>
                </AnimatedText>

                <div className="categories-grid">
                    {categories.map((category, index) => (
                        <AnimatedText
                            key={category.id}
                            direction={index === 0 ? "left" : index === 1 ? "bottom" : "right"}
                            delay={200 + index * 150}
                        >
                            <Link
                                to={`/shop?category=${category.id}`}
                                className="category-card"
                            >
                                <div className="category-image-wrapper">
                                    <img
                                        src={getCategoryImage(category)}
                                        alt={category.name}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/600x400?text=Category';
                                        }}
                                    />
                                    <div className="category-overlay"></div>
                                    <div className="category-shine"></div>
                                </div>
                                <div className="category-content">
                                    <div className="category-icon">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                                        </svg>
                                    </div>
                                    <h3>{category.name}</h3>
                                    <p>{category.description || 'Explore our quality products'}</p>
                                    <button className="category-btn">
                                        <span>View Products</span>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                        </svg>
                                    </button>
                                </div>
                            </Link>
                        </AnimatedText>
                    ))}
                </div>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

        .category-section {
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          padding: 6rem 3rem;
          background: #0F0F0F;
          border-bottom: 1px solid #2a2a2a;
          position: relative;
          overflow: hidden;
        }

        .category-section::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.03) 0%, transparent 70%);
          animation: pulse 15s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(5deg); }
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
          position: relative;
          display: inline-block;
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

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
          padding: 0 1rem;
        }

        .category-card {
          position: relative;
          height: 400px;
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .category-card:hover {
          border-color: #D4AF37;
          transform: translateY(-10px);
          box-shadow: 0 20px 60px rgba(212, 175, 55, 0.3);
        }

        .category-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, #D4AF37, #F4D03F, #D4AF37);
          border-radius: 20px;
          opacity: 0;
          transition: opacity 0.5s;
          z-index: -1;
        }

        .category-card:hover::before {
          opacity: 0.3;
          animation: borderGlow 2s linear infinite;
        }

        @keyframes borderGlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .category-image-wrapper {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
        }

        .category-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .category-card:hover .category-image-wrapper img {
          transform: scale(1.15);
        }

        .category-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(15, 15, 15, 0.8) 100%);
          transition: all 0.5s;
        }

        .category-card:hover .category-overlay {
          background: linear-gradient(180deg, transparent 0%, rgba(212, 175, 55, 0.2) 100%);
        }

        .category-shine {
          position: absolute;
          top: -100%;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: all 0.6s;
        }

        .category-card:hover .category-shine {
          top: 100%;
          left: 100%;
        }

        .category-content {
          padding: 2rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .category-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          color: #0F0F0F;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
        }

        .category-card:hover .category-icon {
          transform: rotate(360deg) scale(1.1);
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.5);
        }

        .category-content h3 {
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.8rem 0;
          transition: color 0.3s;
          letter-spacing: 0.5px;
        }

        .category-card:hover .category-content h3 {
          color: #D4AF37;
        }

        .category-content p {
          color: #999;
          font-size: 0.95rem;
          font-family: 'Poppins', sans-serif;
          margin: 0 0 1.5rem 0;
          line-height: 1.6;
          font-weight: 300;
        }

        .category-btn {
          padding: 0.9rem 2rem;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          color: #0F0F0F;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: auto;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
        }

        .category-btn svg {
          transition: transform 0.3s;
        }

        .category-card:hover .category-btn {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.5);
          background: linear-gradient(135deg, #F4D03F 0%, #D4AF37 100%);
        }

        .category-card:hover .category-btn svg {
          transform: translateX(5px);
        }

        @media (max-width: 1024px) {
          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }

          .section-header h2 {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .category-section {
            padding: 4rem 1.5rem;
          }

          .categories-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .section-header h2 {
            font-size: 2rem;
            letter-spacing: 2px;
          }

          .section-header p {
            font-size: 1rem;
          }

          .category-card {
            height: 350px;
          }

          .category-content h3 {
            font-size: 1.3rem;
          }
        }

        @media (max-width: 480px) {
          .section-header h2 {
            font-size: 1.8rem;
          }

          .category-card {
            height: 320px;
          }
        }
      `}</style>
        </section>
    );
};

export default CategoryGrid;