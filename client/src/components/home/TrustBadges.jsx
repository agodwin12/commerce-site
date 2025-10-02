// src/components/home/TrustBadges.jsx
import React from 'react';
import { Truck, Shield, RefreshCw, Headphones } from 'lucide-react';
import AnimatedText from '../common/AnimatedText';

const TrustBadges = () => {
    const badges = [
        {
            icon: Truck,
            title: "FAST SHIPPING",
            description: "Orders dispatched within 24 hours nationwide",
            delay: 100,
            color: "#D4AF37"
        },
        {
            icon: Shield,
            title: "SECURE PAYMENT",
            description: "Multiple safe payment methods available",
            delay: 200,
            color: "#D4AF37"
        },
        {
            icon: RefreshCw,
            title: "EASY RETURNS",
            description: "30-day return policy on all products guaranteed",
            delay: 300,
            color: "#D4AF37"
        },
        {
            icon: Headphones,
            title: "24/7 SUPPORT",
            description: "Dedicated customer service team ready to help",
            delay: 400,
            color: "#D4AF37"
        }
    ];

    return (
        <section className="trust-badges">
            <div className="badges-container">
                {badges.map((badge, index) => (
                    <AnimatedText key={index} direction="bottom" delay={badge.delay}>
                        <div className="badge-card">
                            <div className="badge-icon-wrapper">
                                <div className="badge-icon">
                                    <badge.icon size={40} strokeWidth={1.5} />
                                </div>
                                <div className="icon-glow"></div>
                            </div>
                            <div className="badge-content">
                                <h3>{badge.title}</h3>
                                <p>{badge.description}</p>
                            </div>
                            <div className="badge-shine"></div>
                        </div>
                    </AnimatedText>
                ))}
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

        .trust-badges {
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          background: #0F0F0F;
          padding: 5rem 3rem;
          border-bottom: 1px solid #2a2a2a;
          position: relative;
          overflow: hidden;
        }

        .trust-badges::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.03) 0%, transparent 50%);
          animation: backgroundFloat 15s ease-in-out infinite;
        }

        @keyframes backgroundFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .badges-container {
          max-width: 1600px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2.5rem;
          position: relative;
          z-index: 1;
        }

        .badge-card {
          text-align: center;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, #1a1a1a 0%, #0F0F0F 100%);
          border: 2px solid #2a2a2a;
          border-radius: 20px;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .badge-card::before {
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
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .badge-card:hover {
          transform: translateY(-15px);
          border-color: #D4AF37;
          box-shadow: 0 25px 70px rgba(212, 175, 55, 0.4);
        }

        .badge-card:hover::before {
          opacity: 0.3;
        }

        .badge-icon-wrapper {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto 2rem;
        }

        .badge-icon {
          width: 100px;
          height: 100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          border-radius: 50%;
          color: #0F0F0F;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 40px rgba(212, 175, 55, 0.3);
          position: relative;
          z-index: 2;
        }

        .badge-card:hover .badge-icon {
          transform: rotate(360deg) scale(1.1);
          box-shadow: 0 15px 50px rgba(212, 175, 55, 0.6);
        }

        .icon-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, transparent 70%);
          border-radius: 50%;
          animation: iconGlow 2s ease-in-out infinite;
          z-index: 1;
        }

        @keyframes iconGlow {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0.3;
          }
        }

        .badge-card:hover .icon-glow {
          animation: iconGlowHover 1s ease-in-out infinite;
        }

        @keyframes iconGlowHover {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.8;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.6);
            opacity: 0.4;
          }
        }

        .badge-content {
          position: relative;
          z-index: 2;
        }

        .badge-card h3 {
          color: #D4AF37;
          font-size: 1.2rem;
          font-weight: 800;
          font-family: 'Poppins', sans-serif;
          margin: 0 0 1rem 0;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          transition: all 0.3s;
        }

        .badge-card:hover h3 {
          color: #F4D03F;
          transform: scale(1.05);
          text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
        }

        .badge-card p {
          color: #999;
          font-size: 0.95rem;
          font-family: 'Poppins', sans-serif;
          margin: 0;
          line-height: 1.7;
          font-weight: 300;
          transition: color 0.3s;
        }

        .badge-card:hover p {
          color: #ccc;
        }

        .badge-shine {
          position: absolute;
          top: -100%;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: all 0.6s;
          pointer-events: none;
        }

        .badge-card:hover .badge-shine {
          top: 100%;
          left: 100%;
        }

        /* Staggered animation on load */
        .badge-card {
          animation: fadeInUp 0.8s ease-out backwards;
        }

        .badge-card:nth-child(1) { animation-delay: 0.1s; }
        .badge-card:nth-child(2) { animation-delay: 0.2s; }
        .badge-card:nth-child(3) { animation-delay: 0.3s; }
        .badge-card:nth-child(4) { animation-delay: 0.4s; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Floating animation */
        .badge-card {
          animation: float 6s ease-in-out infinite;
        }

        .badge-card:nth-child(1) { animation-delay: 0s; }
        .badge-card:nth-child(2) { animation-delay: 1.5s; }
        .badge-card:nth-child(3) { animation-delay: 3s; }
        .badge-card:nth-child(4) { animation-delay: 4.5s; }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .badge-card:hover {
          animation: none;
        }

        @media (max-width: 1200px) {
          .badges-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
        }

        @media (max-width: 768px) {
          .trust-badges {
            padding: 4rem 1.5rem;
          }

          .badges-container {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            max-width: 500px;
          }

          .badge-card {
            padding: 2.5rem 1.5rem;
          }

          .badge-icon-wrapper,
          .badge-icon {
            width: 80px;
            height: 80px;
          }

          .badge-icon svg {
            width: 35px;
            height: 35px;
          }

          .badge-card h3 {
            font-size: 1.1rem;
          }

          .badge-card p {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .badge-card h3 {
            font-size: 1rem;
            letter-spacing: 1px;
          }

          .badge-card p {
            font-size: 0.85rem;
          }

          .badge-icon-wrapper,
          .badge-icon {
            width: 70px;
            height: 70px;
          }

          .badge-icon svg {
            width: 30px;
            height: 30px;
          }
        }

        /* Add pulsing effect on icons */
        @keyframes iconPulse {
          0%, 100% {
            box-shadow: 0 10px 40px rgba(212, 175, 55, 0.3);
          }
          50% {
            box-shadow: 0 10px 40px rgba(212, 175, 55, 0.6);
          }
        }

        .badge-icon {
          animation: iconPulse 3s ease-in-out infinite;
        }

        .badge-card:hover .badge-icon {
          animation: none;
        }
      `}</style>
        </section>
    );
};

export default TrustBadges;