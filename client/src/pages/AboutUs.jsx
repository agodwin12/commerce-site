import React, { useState } from 'react';
import { Heart, Award, Users, Target, Sparkles, CheckCircle, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

const AboutUs = () => {
    const [activeValue, setActiveValue] = useState(0);

    const stats = [
        { number: '15+', label: 'Years Experience' },
        { number: '50K+', label: 'Happy Customers' },
        { number: '10K+', label: 'Products Sold' },
        { number: '98%', label: 'Satisfaction Rate' }
    ];

    const values = [
        {
            icon: <Heart size={40} />,
            title: 'Customer First',
            description: 'Your health and satisfaction are our top priorities. We go above and beyond to ensure every customer receives personalized care and attention.'
        },
        {
            icon: <Award size={40} />,
            title: 'Quality Assured',
            description: 'We source only certified, premium-quality pharmaceutical products from trusted manufacturers, ensuring safety and efficacy in every product.'
        },
        {
            icon: <Users size={40} />,
            title: 'Expert Team',
            description: 'Our team of licensed pharmacists and healthcare professionals are always ready to provide expert guidance and support for your wellness journey.'
        },
        {
            icon: <Target size={40} />,
            title: 'Innovation',
            description: 'Embracing cutting-edge technology and practices to deliver the most convenient and efficient healthcare solutions to your doorstep.'
        }
    ];

    const team = [
        {
            name: 'Dr. Sarah Johnson',
            role: 'Chief Pharmacist',
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop'
        },
        {
            name: 'Michael Chen',
            role: 'Operations Director',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
        },
        {
            name: 'Emily Rodriguez',
            role: 'Customer Care Lead',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop'
        },
        {
            name: 'Dr. James Williams',
            role: 'Medical Advisor',
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop'
        }
    ];

    const features = [
        'FDA Approved Products',
        'Licensed Pharmacists',
        'Secure Transactions',
        'Fast Delivery',
        '24/7 Support',
        'Privacy Protected'
    ];

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <Sparkles size={16} />
                        <span>Trusted Healthcare Partner Since 2009</span>
                    </div>
                    <h1>Your Health, Our Mission</h1>
                    <p>Delivering quality pharmaceutical products and exceptional care to communities worldwide</p>
                    <div className="hero-buttons">
                        <button className="primary-btn">
                            Explore Products
                            <ArrowRight size={18} />
                        </button>
                        <button className="secondary-btn">Contact Us</button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <h2>{stat.number}</h2>
                            <p>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Story Section */}
            <section className="story-section">
                <div className="story-content">
                    <div className="story-image">
                        <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop" alt="Pharmacy" />
                        <div className="image-overlay"></div>
                    </div>
                    <div className="story-text">
                        <h2>Our Story</h2>
                        <div className="divider"></div>
                        <p>Founded in 2009, we began with a simple vision: to make quality healthcare accessible to everyone. What started as a small community pharmacy has grown into a trusted online healthcare destination serving thousands of customers.</p>
                        <p>Our commitment to excellence, combined with cutting-edge technology and a passionate team, has enabled us to revolutionize the way people access pharmaceutical products and healthcare solutions.</p>
                        <p>Today, we're proud to be at the forefront of digital healthcare, continuously innovating to meet the evolving needs of our customers while maintaining the personal touch that has always defined us.</p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="values-section">
                <div className="section-header">
                    <h2>Our Core Values</h2>
                    <p>The principles that guide everything we do</p>
                </div>
                <div className="values-grid">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className={`value-card ${activeValue === index ? 'active' : ''}`}
                            onMouseEnter={() => setActiveValue(index)}
                        >
                            <div className="value-icon">
                                {value.icon}
                            </div>
                            <h3>{value.title}</h3>
                            <p>{value.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="features-content">
                    <h2>Why Choose Us</h2>
                    <div className="divider"></div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-item">
                                <CheckCircle size={20} />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="team-section">
                <div className="section-header">
                    <h2>Meet Our Team</h2>
                    <p>Dedicated professionals committed to your wellbeing</p>
                </div>
                <div className="team-grid">
                    {team.map((member, index) => (
                        <div key={index} className="team-card">
                            <div className="team-image">
                                <img src={member.image} alt={member.name} />
                                <div className="team-overlay">
                                    <div className="social-links">
                                        <button className="social-btn">in</button>
                                        <button className="social-btn">@</button>
                                    </div>
                                </div>
                            </div>
                            <div className="team-info">
                                <h3>{member.name}</h3>
                                <p>{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Experience Better Healthcare?</h2>
                    <p>Join thousands of satisfied customers who trust us with their health needs</p>
                    <button className="cta-btn">
                        Start Shopping Now
                        <ArrowRight size={20} />
                    </button>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section">
                <div className="contact-grid">
                    <div className="contact-card">
                        <Phone size={32} />
                        <h3>Call Us</h3>
                        <p>+1 (555) 123-4567</p>
                        <span>Mon-Fri 9am-6pm</span>
                    </div>
                    <div className="contact-card">
                        <Mail size={32} />
                        <h3>Email Us</h3>
                        <p>support@pharmacare.com</p>
                        <span>24/7 Response</span>
                    </div>
                    <div className="contact-card">
                        <MapPin size={32} />
                        <h3>Visit Us</h3>
                        <p>123 Healthcare Ave</p>
                        <span>New York, NY 10001</span>
                    </div>
                </div>
            </section>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .about-page {
          width: 100%;
          min-height: 100vh;
          background: #0F0F0F;
          font-family: 'Poppins', sans-serif;
          padding-top: 80px;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          padding: 6rem 2rem;
          background: linear-gradient(135deg, #1a1a1a 0%, #0F0F0F 100%);
          border-bottom: 1px solid #2a2a2a;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-content {
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.5rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 50px;
          color: #D4AF37;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 2rem;
          animation: fadeInDown 0.8s ease;
        }

        .hero-section h1 {
          font-size: 4.5rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          letter-spacing: -1px;
          animation: fadeInUp 0.8s ease 0.2s backwards;
        }

        .hero-section p {
          font-size: 1.3rem;
          color: #999;
          margin-bottom: 3rem;
          font-weight: 300;
          line-height: 1.6;
          animation: fadeInUp 0.8s ease 0.4s backwards;
        }

        .hero-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          animation: fadeInUp 0.8s ease 0.6s backwards;
        }

        .primary-btn {
          padding: 1.1rem 2.5rem;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          color: #0F0F0F;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          transition: all 0.3s;
          font-family: 'Poppins', sans-serif;
        }

        .primary-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(212, 175, 55, 0.4);
        }

        .secondary-btn {
          padding: 1.1rem 2.5rem;
          background: transparent;
          color: #D4AF37;
          border: 2px solid #D4AF37;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'Poppins', sans-serif;
        }

        .secondary-btn:hover {
          background: rgba(212, 175, 55, 0.1);
          transform: translateY(-3px);
        }

        /* Stats Section */
        .stats-section {
          padding: 4rem 2rem;
          background: #0F0F0F;
        }

        .stats-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .stat-card {
          text-align: center;
          padding: 2.5rem 1.5rem;
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          border-radius: 16px;
          transition: all 0.4s;
        }

        .stat-card:hover {
          border-color: #D4AF37;
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(212, 175, 55, 0.2);
        }

        .stat-card h2 {
          font-size: 3.5rem;
          font-weight: 900;
          color: #D4AF37;
          margin-bottom: 0.5rem;
          line-height: 1;
        }

        .stat-card p {
          color: #999;
          font-size: 1rem;
          font-weight: 500;
        }

        /* Story Section */
        .story-section {
          padding: 6rem 2rem;
          background: linear-gradient(180deg, #0F0F0F 0%, #1a1a1a 100%);
        }

        .story-content {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        .story-image {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          height: 500px;
        }

        .story-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(15, 15, 15, 0.4) 100%);
        }

        .story-text h2 {
          font-size: 3rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 1.5rem;
        }

        .divider {
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #D4AF37 0%, #F4D03F 100%);
          margin-bottom: 2rem;
          border-radius: 2px;
        }

        .story-text p {
          color: #bbb;
          font-size: 1.05rem;
          line-height: 1.8;
          margin-bottom: 1.5rem;
          font-weight: 300;
        }

        /* Values Section */
        .values-section {
          padding: 6rem 2rem;
          background: #0F0F0F;
        }

        .section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 4rem;
        }

        .section-header h2 {
          font-size: 3rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 1rem;
        }

        .section-header p {
          color: #999;
          font-size: 1.1rem;
          font-weight: 300;
        }

        .values-grid {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2.5rem;
        }

        .value-card {
          padding: 3rem;
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          border-radius: 20px;
          transition: all 0.4s;
          cursor: pointer;
        }

        .value-card:hover,
        .value-card.active {
          border-color: #D4AF37;
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(212, 175, 55, 0.2);
        }

        .value-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D4AF37;
          margin-bottom: 2rem;
          transition: all 0.4s;
        }

        .value-card:hover .value-icon,
        .value-card.active .value-icon {
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          color: #0F0F0F;
          transform: scale(1.05);
        }

        .value-card h3 {
          font-size: 1.6rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 1rem;
        }

        .value-card p {
          color: #999;
          font-size: 1rem;
          line-height: 1.7;
          font-weight: 300;
        }

        /* Features Section */
        .features-section {
          padding: 6rem 2rem;
          background: linear-gradient(180deg, #0F0F0F 0%, #1a1a1a 100%);
        }

        .features-content {
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .features-content h2 {
          font-size: 3rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 1.5rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 3rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(212, 175, 55, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          color: #D4AF37;
          font-weight: 600;
          transition: all 0.3s;
        }

        .feature-item:hover {
          background: rgba(212, 175, 55, 0.1);
          transform: translateX(5px);
        }

        /* Team Section */
        .team-section {
          padding: 6rem 2rem;
          background: #0F0F0F;
        }

        .team-grid {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2.5rem;
        }

        .team-card {
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s;
        }

        .team-card:hover {
          border-color: #D4AF37;
          transform: translateY(-10px);
          box-shadow: 0 20px 50px rgba(212, 175, 55, 0.2);
        }

        .team-image {
          position: relative;
          height: 300px;
          overflow: hidden;
        }

        .team-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .team-card:hover .team-image img {
          transform: scale(1.1);
        }

        .team-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 15, 15, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .team-card:hover .team-overlay {
          opacity: 1;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-btn {
          width: 45px;
          height: 45px;
          background: #D4AF37;
          border: none;
          border-radius: 50%;
          color: #0F0F0F;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }

        .social-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
        }

        .team-info {
          padding: 2rem;
          text-align: center;
        }

        .team-info h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .team-info p {
          color: #D4AF37;
          font-size: 0.95rem;
          font-weight: 500;
        }

        /* CTA Section */
        .cta-section {
          padding: 6rem 2rem;
          background: linear-gradient(135deg, #1a1a1a 0%, #0F0F0F 100%);
          border-top: 1px solid #2a2a2a;
          border-bottom: 1px solid #2a2a2a;
        }

        .cta-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .cta-content h2 {
          font-size: 3rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .cta-content p {
          font-size: 1.2rem;
          color: #999;
          margin-bottom: 3rem;
          font-weight: 300;
        }

        .cta-btn {
          padding: 1.2rem 3rem;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          color: #0F0F0F;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          transition: all 0.3s;
          font-family: 'Poppins', sans-serif;
        }

        .cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(212, 175, 55, 0.5);
        }

        /* Contact Section */
        .contact-section {
          padding: 6rem 2rem;
          background: #0F0F0F;
        }

        .contact-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
        }

        .contact-card {
          text-align: center;
          padding: 3rem 2rem;
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          border-radius: 20px;
          transition: all 0.4s;
        }

        .contact-card:hover {
          border-color: #D4AF37;
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(212, 175, 55, 0.2);
        }

        .contact-card svg {
          color: #D4AF37;
          margin-bottom: 1.5rem;
        }

        .contact-card h3 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 1rem;
        }

        .contact-card p {
          font-size: 1.1rem;
          color: #D4AF37;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .contact-card span {
          color: #999;
          font-size: 0.9rem;
        }

        /* Animations */
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        /* Responsive Design */
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .team-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 968px) {
          .about-page {
            padding-top: 70px;
          }

          .hero-section {
            padding: 4rem 1.5rem;
          }

          .hero-section h1 {
            font-size: 3rem;
          }

          .hero-section p {
            font-size: 1.1rem;
          }

          .hero-buttons {
            flex-direction: column;
          }

          .primary-btn,
          .secondary-btn {
            width: 100%;
            justify-content: center;
          }

          .story-content {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .story-image {
            height: 400px;
          }

          .values-grid {
            grid-template-columns: 1fr;
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .contact-grid {
            grid-template-columns: 1fr;
          }

          .section-header h2 {
            font-size: 2.5rem;
          }

          .story-text h2 {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 640px) {
          .hero-section h1 {
            font-size: 2.2rem;
          }

          .hero-section p {
            font-size: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .stat-card h2 {
            font-size: 2.8rem;
          }

          .story-image {
            height: 300px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .team-grid {
            grid-template-columns: 1fr;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .story-text h2 {
            font-size: 2rem;
          }

          .cta-content h2 {
            font-size: 2rem;
          }

          .value-card {
            padding: 2rem;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            padding: 3rem 1rem;
          }

          .primary-btn,
          .secondary-btn {
            padding: 1rem 2rem;
            font-size: 0.95rem;
          }

          .value-icon {
            width: 65px;
            height: 65px;
          }

          .value-icon svg {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
        </div>
    );
};

export default AboutUs;