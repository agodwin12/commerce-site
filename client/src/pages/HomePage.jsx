// src/pages/HomePage.jsx
import React from 'react';
import HeroSlider from '../components/home/HeroSlider';
import TrustBadges from '../components/home/TrustBadges';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedProducts from '../components/home/FeaturedProducts';

const HomePage = () => {
    return (
        <div className="homepage">
            <main style={{ marginTop: '80px' }}>
                <HeroSlider />
                <TrustBadges />
                <CategoryGrid />
                <FeaturedProducts />
            </main>
        </div>
    );
};

export default HomePage;