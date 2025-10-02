// src/components/home/HeroSlider.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedText from '../common/AnimatedText';

const HeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [key, setKey] = useState(0);

    // INSTRUCTIONS FOR IMAGES:
    // Place your 3 hero images in the public/images folder:
    // 1. public/images/hero-1.jpg
    // 2. public/images/hero-2.jpg
    // 3. public/images/hero-3.jpg
    // Recommended size: 1920x1080px

    const slides = [
        {
            title: "PREMIUM PHARMACEUTICAL",
            subtitle: "PRODUCTS",
            description: "Quality healthcare products you can trust",
            cta: "Shop Now",
            image: "/images/hero1.webp"
        },
        {
            title: "FAST & SECURE",
            subtitle: "DELIVERY",
            description: "Orders shipped within 24 hours nationwide",
            cta: "Learn More",
            image: "/images/hero3.jpg"
        },
        {
            title: "PROTECT YOURSELF",
            subtitle: "& OTHERS",
            description: "High-quality medical supplies and equipment",
            cta: "Browse Products",
            image: "/images/hero2.webp"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentSlide]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setKey((prev) => prev + 1);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setKey((prev) => prev + 1);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setKey((prev) => prev + 1);
    };

    return (
        <div className="hero-slider">
            <div
                className="slide active"
                style={{
                    backgroundImage: `linear-gradient(rgba(15, 15, 15, 0.6), rgba(15, 15, 15, 0.6)), url(${slides[currentSlide].image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="slide-content" key={key}>
                    <AnimatedText direction="left" delay={100}>
                        <h1 className="hero-title">{slides[currentSlide].title}</h1>
                    </AnimatedText>

                    <AnimatedText direction="right" delay={300}>
                        <h2 className="hero-subtitle">{slides[currentSlide].subtitle}</h2>
                    </AnimatedText>

                    <AnimatedText direction="bottom" delay={500}>
                        <p className="hero-description">{slides[currentSlide].description}</p>
                    </AnimatedText>

                    <AnimatedText direction="bottom" delay={700}>
                        <Link to="/shop" className="cta-button">
                            {slides[currentSlide].cta}
                        </Link>
                    </AnimatedText>
                </div>

                <button className="slide-nav prev" onClick={prevSlide}>
                    <ChevronLeft size={32} />
                </button>

                <button className="slide-nav next" onClick={nextSlide}>
                    <ChevronRight size={32} />
                </button>

                <div className="slide-dots">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

        .hero-slider {
          position: relative;
          width: 100vw;
          height: 100vh;
          min-height: 600px;
          overflow: hidden;
          margin-left: calc(-50vw + 50%);
        }

        .slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          transition: all 0.8s ease;
        }

        .slide-content {
          max-width: 1200px;
          width: 100%;
          text-align: center;
          z-index: 2;
          padding: 0 2rem;
        }

        .hero-title {
          font-family: 'Poppins', sans-serif;
          font-size: 5rem;
          font-weight: 900;
          color: #fff;
          margin: 0;
          letter-spacing: 4px;
          text-shadow: 3px 3px 10px rgba(0,0,0,0.7);
          line-height: 1.1;
          animation: fadeInScale 0.8s ease-out;
        }

        .hero-subtitle {
          font-family: 'Poppins', sans-serif;
          font-size: 5rem;
          font-weight: 900;
          color: #D4AF37;
          margin: 0;
          letter-spacing: 4px;
          text-shadow: 3px 3px 10px rgba(0,0,0,0.7);
          line-height: 1.1;
          animation: fadeInScale 0.8s ease-out 0.2s both;
        }

        .hero-description {
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          color: #e0e0e0;
          margin: 2rem 0;
          font-weight: 400;
          letter-spacing: 1px;
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .cta-button {
          display: inline-block;
          padding: 1.2rem 3.5rem;
          font-size: 1.1rem;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          color: #0F0F0F;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: 1rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
          animation: fadeInUp 0.8s ease-out 0.6s both;
          text-decoration: none;
        }

        .cta-button:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 15px 40px rgba(212, 175, 55, 0.5);
          background: linear-gradient(135deg, #F4D03F 0%, #D4AF37 100%);
        }

        .slide-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(212, 175, 55, 0.15);
          backdrop-filter: blur(10px);
          border: 2px solid #D4AF37;
          color: #D4AF37;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
        }

        .slide-nav:hover {
          background: #D4AF37;
          color: #0F0F0F;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
        }

        .slide-nav.prev {
          left: 3rem;
        }

        .slide-nav.next {
          right: 3rem;
        }

        .slide-dots {
          position: absolute;
          bottom: 3rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 1rem;
          z-index: 10;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid #D4AF37;
          background: transparent;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0;
        }

        .dot:hover {
          background: rgba(212, 175, 55, 0.5);
          transform: scale(1.2);
        }

        .dot.active {
          background: #D4AF37;
          width: 40px;
          border-radius: 6px;
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.6);
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1024px) {
          .hero-title,
          .hero-subtitle {
            font-size: 3.5rem;
          }

          .hero-description {
            font-size: 1.2rem;
          }

          .slide-nav {
            width: 50px;
            height: 50px;
          }

          .slide-nav.prev {
            left: 1.5rem;
          }

          .slide-nav.next {
            right: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .hero-title,
          .hero-subtitle {
            font-size: 2.5rem;
            letter-spacing: 2px;
          }

          .hero-description {
            font-size: 1rem;
            margin: 1.5rem 0;
          }

          .cta-button {
            padding: 1rem 2.5rem;
            font-size: 1rem;
          }

          .slide-nav {
            width: 45px;
            height: 45px;
          }

          .slide-nav.prev {
            left: 1rem;
          }

          .slide-nav.next {
            right: 1rem;
          }

          .slide-dots {
            bottom: 2rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title,
          .hero-subtitle {
            font-size: 2rem;
          }

          .hero-description {
            font-size: 0.9rem;
          }

          .cta-button {
            padding: 0.9rem 2rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
        </div>
    );
};

export default HeroSlider;