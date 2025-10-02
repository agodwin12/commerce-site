// src/components/layout/Footer.jsx
import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="footer">
            {/* Newsletter Section */}
            <div className="newsletter-section">
                <div className="newsletter-container">
                    <div className="newsletter-content">
                        <h2>Subscribe to Our Newsletter</h2>
                        <p>Get the latest updates on new products, special offers, and health tips</p>
                    </div>
                    <div className="newsletter-form">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            aria-label="Email for newsletter"
                        />
                        <button type="submit">Subscribe</button>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="footer-main">
                <div className="footer-container">
                    <div className="footer-section about-section">
                        <h3>Powersynth Labs<span className="gold-plus">+</span></h3>
                        <p>
                            Your trusted source for premium pharmaceutical products and medical supplies.
                            We prioritize quality, security, and customer satisfaction in everything we do.
                        </p>
                        <div className="social-links">
                            <a href="#" aria-label="Facebook" className="social-icon">
                                <Facebook size={20} />
                            </a>
                            <a href="#" aria-label="Twitter" className="social-icon">
                                <Twitter size={20} />
                            </a>
                            <a href="#" aria-label="Instagram" className="social-icon">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/products">Products</a></li>
                            <li><a href="/categories">Categories</a></li>
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3>Customer Service</h3>
                        <ul>
                            <li><a href="/shipping">Shipping Policy</a></li>
                            <li><a href="/returns">Returns & Exchange</a></li>
                            <li><a href="/faq">FAQ</a></li>
                            <li><a href="/terms">Terms & Conditions</a></li>
                            <li><a href="/privacy">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3>Contact Us</h3>
                        <div className="contact-info">
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <MapPin size={18} />
                                </div>
                                <span>123 Medical Street, Healthcare City, HC 12345</span>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <Phone size={18} />
                                </div>
                                <span>+1 (234) 567-8900</span>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <Mail size={18} />
                                </div>
                                <span>support@Powersynth Labs.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="footer-bottom-container">
                    <p>&copy; 2025 Powersynth Labs+. All rights reserved. Made with <span className="heart">❤</span> for your health</p>
                    <div className="payment-methods">
                        <span>We Accept:</span>
                        <div className="payment-icons">
                            <div className="payment-icon">VISA</div>
                            <div className="payment-icon">MC</div>
                            <div className="payment-icon">PAYPAL</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            <button className="scroll-to-top" onClick={scrollToTop} aria-label="Scroll to top">
                <ArrowUp size={24} />
            </button>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

        .footer {
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          background: #0F0F0F;
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, rgba(212, 175, 55, 0.03) 0%, transparent 50%);
          pointer-events: none;
        }

        /* Newsletter Section */
        .newsletter-section {
          background: linear-gradient(135deg, #1a1a1a 0%, #0F0F0F 100%);
          padding: 4rem 3rem;
          border-bottom: 1px solid #2a2a2a;
          position: relative;
          z-index: 1;
        }

        .newsletter-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 3rem;
        }

        .newsletter-content h2 {
          font-family: 'Poppins', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #D4AF37;
          margin: 0 0 0.5rem 0;
          letter-spacing: 1px;
        }

        .newsletter-content p {
          font-family: 'Poppins', sans-serif;
          color: #999;
          margin: 0;
          font-size: 1rem;
          font-weight: 300;
        }

        .newsletter-form {
          display: flex;
          gap: 1rem;
          flex: 1;
          max-width: 500px;
        }

        .newsletter-form input {
          flex: 1;
          padding: 1rem 1.5rem;
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          border-radius: 50px;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 0.95rem;
          transition: all 0.3s;
        }

        .newsletter-form input:focus {
          outline: none;
          border-color: #D4AF37;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
        }

        .newsletter-form button {
          padding: 1rem 2.5rem;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          border: none;
          border-radius: 50px;
          color: #0F0F0F;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: 0.5px;
          text-transform: uppercase;
          box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
          white-space: nowrap;
        }

        .newsletter-form button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.5);
          background: linear-gradient(135deg, #F4D03F 0%, #D4AF37 100%);
        }

        /* Main Footer */
        .footer-main {
          padding: 4rem 3rem 2rem;
          position: relative;
          z-index: 1;
        }

        .footer-container {
          max-width: 1600px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 3rem;
        }

        .footer-section h3 {
          color: #D4AF37;
          font-size: 1.3rem;
          font-family: 'Poppins', sans-serif;
          margin: 0 0 1.5rem 0;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          position: relative;
          display: inline-block;
        }

        .footer-section h3::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 40px;
          height: 3px;
          background: linear-gradient(90deg, #D4AF37, transparent);
          border-radius: 2px;
        }

        .about-section h3 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .gold-plus {
          color: #D4AF37;
        }

        .about-section p {
          color: #999;
          line-height: 1.8;
          margin: 0 0 2rem 0;
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
          font-size: 0.95rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-icon {
          width: 45px;
          height: 45px;
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D4AF37;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .social-icon::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          border-radius: 50%;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: -1;
        }

        .social-icon:hover {
          color: #0F0F0F;
          border-color: #D4AF37;
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
        }

        .social-icon:hover::before {
          transform: translate(-50%, -50%) scale(1);
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-section ul li {
          margin-bottom: 1rem;
        }

        .footer-section ul li a {
          color: #999;
          text-decoration: none;
          font-family: 'Poppins', sans-serif;
          font-weight: 400;
          font-size: 0.95rem;
          transition: all 0.3s;
          display: inline-block;
          position: relative;
          padding-left: 15px;
        }

        .footer-section ul li a::before {
          content: '→';
          position: absolute;
          left: 0;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s;
          color: #D4AF37;
        }

        .footer-section ul li a:hover {
          color: #D4AF37;
          padding-left: 20px;
        }

        .footer-section ul li a:hover::before {
          opacity: 1;
          transform: translateX(0);
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          color: #999;
          font-family: 'Poppins', sans-serif;
          font-size: 0.95rem;
          font-weight: 300;
          transition: all 0.3s;
          cursor: pointer;
        }

        .contact-item:hover {
          color: #D4AF37;
        }

        .contact-icon {
          width: 38px;
          height: 38px;
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D4AF37;
          flex-shrink: 0;
          transition: all 0.3s;
        }

        .contact-item:hover .contact-icon {
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          color: #0F0F0F;
          border-color: #D4AF37;
          transform: rotate(360deg);
        }

        /* Footer Bottom */
        .footer-bottom {
          border-top: 1px solid #2a2a2a;
          padding: 2rem 3rem;
          position: relative;
          z-index: 1;
        }

        .footer-bottom-container {
          max-width: 1600px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-bottom p {
          color: #666;
          margin: 0;
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
          font-size: 0.9rem;
        }

        .heart {
          color: #D4AF37;
          animation: heartBeat 1.5s ease-in-out infinite;
        }

        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.2); }
          50% { transform: scale(1); }
        }

        .payment-methods {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #666;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
        }

        .payment-icons {
          display: flex;
          gap: 0.5rem;
        }

        .payment-icon {
          padding: 0.4rem 0.8rem;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 6px;
          color: #D4AF37;
          font-size: 0.7rem;
          font-weight: 700;
          transition: all 0.3s;
        }

        .payment-icon:hover {
          background: #D4AF37;
          color: #0F0F0F;
          transform: translateY(-2px);
        }

        /* Scroll to Top Button */
        .scroll-to-top {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 55px;
          height: 55px;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          border: none;
          border-radius: 50%;
          color: #0F0F0F;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
        }

        .scroll-to-top:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 35px rgba(212, 175, 55, 0.6);
        }

        .scroll-to-top:active {
          transform: translateY(-2px);
        }

        @media (max-width: 1200px) {
          .footer-container {
            grid-template-columns: repeat(2, 1fr);
          }

          .about-section {
            grid-column: span 2;
          }
        }

        @media (max-width: 768px) {
          .newsletter-section {
            padding: 3rem 1.5rem;
          }

          .newsletter-container {
            flex-direction: column;
            text-align: center;
          }

          .newsletter-content h2 {
            font-size: 1.5rem;
          }

          .newsletter-form {
            max-width: 100%;
          }

          .footer-main {
            padding: 3rem 1.5rem 1.5rem;
          }

          .footer-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .about-section {
            grid-column: span 1;
          }

          .footer-bottom {
            padding: 1.5rem;
          }

          .footer-bottom-container {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }

          .scroll-to-top {
            width: 50px;
            height: 50px;
            bottom: 1.5rem;
            right: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .newsletter-form {
            flex-direction: column;
          }

          .newsletter-form button {
            padding: 1rem 2rem;
          }

          .footer-section h3 {
            font-size: 1.1rem;
          }

          .about-section h3 {
            font-size: 1.5rem;
          }

          .scroll-to-top {
            width: 45px;
            height: 45px;
          }

          .scroll-to-top svg {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
        </footer>
    );
};

export default Footer;