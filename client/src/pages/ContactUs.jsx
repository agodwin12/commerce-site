import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, HelpCircle, ShoppingBag, AlertCircle } from 'lucide-react';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const contactInfo = [
        {
            icon: <Phone size={28} />,
            title: 'Phone',
            details: ['+1 (555) 123-4567', '+1 (555) 123-4568'],
            subtext: 'Mon-Fri 9AM-6PM EST'
        },
        {
            icon: <Mail size={28} />,
            title: 'Email',
            details: ['support@pharmacare.com', 'orders@pharmacare.com'],
            subtext: '24/7 Email Support'
        },
        {
            icon: <MapPin size={28} />,
            title: 'Location',
            details: ['123 Healthcare Avenue', 'New York, NY 10001'],
            subtext: 'Visit our main office'
        },
        {
            icon: <Clock size={28} />,
            title: 'Business Hours',
            details: ['Monday - Friday: 9AM - 6PM', 'Saturday: 10AM - 4PM'],
            subtext: 'Closed on Sundays'
        }
    ];

    const departments = [
        {
            icon: <ShoppingBag size={24} />,
            title: 'Orders & Shipping',
            email: 'orders@pharmacare.com',
            description: 'Track orders, shipping inquiries, and delivery issues'
        },
        {
            icon: <HelpCircle size={24} />,
            title: 'Product Support',
            email: 'support@pharmacare.com',
            description: 'Product questions, usage guidance, and recommendations'
        },
        {
            icon: <MessageSquare size={24} />,
            title: 'General Inquiries',
            email: 'info@pharmacare.com',
            description: 'General questions, partnerships, and feedback'
        }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            setSubmitted(true);

            setTimeout(() => {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
                setSubmitted(false);
            }, 3000);
        }
    };

    return (
        <div className="contact-page">
            {/* Hero Section */}
            <section className="contact-hero">
                <div className="hero-content">
                    <h1>Get In Touch</h1>
                    <p>We're here to help with any questions or concerns you may have</p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="contact-info-section">
                <div className="info-grid">
                    {contactInfo.map((info, index) => (
                        <div key={index} className="info-card">
                            <div className="info-icon">{info.icon}</div>
                            <h3>{info.title}</h3>
                            {info.details.map((detail, idx) => (
                                <p key={idx} className="info-detail">{detail}</p>
                            ))}
                            <span className="info-subtext">{info.subtext}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Main Contact Section */}
            <section className="main-contact-section">
                <div className="contact-container">
                    {/* Contact Form */}
                    <div className="form-section">
                        <div className="form-header">
                            <h2>Send Us a Message</h2>
                            <p>Fill out the form below and we'll get back to you as soon as possible</p>
                        </div>

                        <div className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={errors.name ? 'error' : ''}
                                        placeholder="John Doe"
                                    />
                                    {errors.name && (
                                        <span className="error-message">
                      <AlertCircle size={14} />
                                            {errors.name}
                    </span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={errors.email ? 'error' : ''}
                                        placeholder="john@example.com"
                                    />
                                    {errors.email && (
                                        <span className="error-message">
                      <AlertCircle size={14} />
                                            {errors.email}
                    </span>
                                    )}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Subject *</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className={errors.subject ? 'error' : ''}
                                        placeholder="How can we help?"
                                    />
                                    {errors.subject && (
                                        <span className="error-message">
                      <AlertCircle size={14} />
                                            {errors.subject}
                    </span>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Your Message *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className={errors.message ? 'error' : ''}
                                    placeholder="Tell us more about your inquiry..."
                                    rows="6"
                                ></textarea>
                                {errors.message && (
                                    <span className="error-message">
                    <AlertCircle size={14} />
                                        {errors.message}
                  </span>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                className={`submit-btn ${submitted ? 'submitted' : ''}`}
                            >
                                {submitted ? (
                                    <span>✓ Message Sent!</span>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Departments Section */}
                    <div className="departments-section">
                        <div className="departments-header">
                            <h2>Contact Departments</h2>
                            <p>Reach out to the right team for faster assistance</p>
                        </div>

                        <div className="departments-list">
                            {departments.map((dept, index) => (
                                <div key={index} className="department-card">
                                    <div className="dept-icon">{dept.icon}</div>
                                    <div className="dept-content">
                                        <h3>{dept.title}</h3>
                                        <p>{dept.description}</p>
                                        <a href={`mailto:${dept.email}`} className="dept-email">
                                            {dept.email}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* FAQ Quick Link */}
                        <div className="faq-card">
                            <HelpCircle size={32} />
                            <h3>Frequently Asked Questions</h3>
                            <p>Find quick answers to common questions in our FAQ section</p>
                            <button className="faq-btn">View FAQs</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="map-section">
                <div className="map-container">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976!3d40.697663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1234567890"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Location Map"
                    ></iframe>
                </div>
            </section>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .contact-page {
          width: 100%;
          min-height: 100vh;
          background: #0F0F0F;
          font-family: 'Poppins', sans-serif;
          padding-top: 80px;
        }

        /* Hero Section */
        .contact-hero {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #1a1a1a 0%, #0F0F0F 100%);
          border-bottom: 1px solid #2a2a2a;
          text-align: center;
        }

        .hero-content h1 {
          font-size: 3.5rem;
          font-weight: 900;
          color: #D4AF37;
          margin-bottom: 1rem;
          letter-spacing: -1px;
        }

        .hero-content p {
          font-size: 1.2rem;
          color: #999;
          font-weight: 300;
        }

        /* Contact Info Section */
        .contact-info-section {
          padding: 4rem 2rem;
          background: #0F0F0F;
        }

        .info-grid {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .info-card {
          text-align: center;
          padding: 2.5rem 1.5rem;
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          border-radius: 16px;
          transition: all 0.4s;
        }

        .info-card:hover {
          border-color: #D4AF37;
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(212, 175, 55, 0.2);
        }

        .info-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 1.5rem;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D4AF37;
          transition: all 0.4s;
        }

        .info-card:hover .info-icon {
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          color: #0F0F0F;
          transform: scale(1.1);
        }

        .info-card h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 1rem;
        }

        .info-detail {
          color: #bbb;
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
          font-weight: 400;
        }

        .info-subtext {
          display: block;
          color: #D4AF37;
          font-size: 0.85rem;
          font-weight: 600;
          margin-top: 1rem;
        }

        /* Main Contact Section */
        .main-contact-section {
          padding: 4rem 2rem;
          background: linear-gradient(180deg, #0F0F0F 0%, #1a1a1a 100%);
        }

        .contact-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 3rem;
        }

        /* Form Section */
        .form-section {
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          border-radius: 20px;
          padding: 3rem;
        }

        .form-header {
          margin-bottom: 2.5rem;
        }

        .form-header h2 {
          font-size: 2rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0.8rem;
        }

        .form-header p {
          color: #999;
          font-size: 1rem;
          font-weight: 300;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          color: #fff;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .form-group input,
        .form-group textarea {
          padding: 1rem 1.2rem;
          background: #0F0F0F;
          border: 2px solid #2a2a2a;
          border-radius: 10px;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 0.95rem;
          transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #D4AF37;
          background: rgba(212, 175, 55, 0.05);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #666;
        }

        .form-group input.error,
        .form-group textarea.error {
          border-color: #f44336;
        }

        .error-message {
          color: #f44336;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 150px;
        }

        .submit-btn {
          margin-top: 1rem;
          padding: 1.1rem 2rem;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          color: #0F0F0F;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          transition: all 0.3s;
          font-family: 'Poppins', sans-serif;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
        }

        .submit-btn.submitted {
          background: #4CAF50;
          color: #fff;
        }

        /* Departments Section */
        .departments-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .departments-header h2 {
          font-size: 1.8rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .departments-header p {
          color: #999;
          font-size: 0.95rem;
          font-weight: 300;
        }

        .departments-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .department-card {
          padding: 1.8rem;
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          border-radius: 16px;
          display: flex;
          gap: 1.2rem;
          transition: all 0.3s;
        }

        .department-card:hover {
          border-color: #D4AF37;
          transform: translateX(5px);
        }

        .dept-icon {
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D4AF37;
        }

        .dept-content h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .dept-content p {
          color: #999;
          font-size: 0.9rem;
          margin-bottom: 0.8rem;
          line-height: 1.5;
        }

        .dept-email {
          color: #D4AF37;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s;
        }

        .dept-email:hover {
          color: #F4D03F;
        }

        /* FAQ Card */
        .faq-card {
          padding: 2.5rem;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          text-align: center;
        }

        .faq-card svg {
          color: #D4AF37;
          margin-bottom: 1rem;
        }

        .faq-card h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.8rem;
        }

        .faq-card p {
          color: #bbb;
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
        }

        .faq-btn {
          padding: 0.9rem 2rem;
          background: #D4AF37;
          color: #0F0F0F;
          border: none;
          border-radius: 25px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'Poppins', sans-serif;
        }

        .faq-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
        }

        /* Map Section */
        .map-section {
          padding: 0;
          background: #0F0F0F;
        }

        .map-container {
          width: 100%;
          height: 500px;
          border-top: 1px solid #2a2a2a;
          border-bottom: 1px solid #2a2a2a;
        }

        .map-container iframe {
          filter: grayscale(100%) invert(92%) contrast(83%);
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .info-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .contact-container {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 968px) {
          .contact-page {
            padding-top: 70px;
          }

          .contact-hero {
            padding: 3rem 1.5rem;
          }

          .hero-content h1 {
            font-size: 2.8rem;
          }

          .hero-content p {
            font-size: 1.1rem;
          }

          .form-section {
            padding: 2rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .contact-hero {
            padding: 2.5rem 1.2rem;
          }

          .hero-content h1 {
            font-size: 2.2rem;
          }

          .hero-content p {
            font-size: 1rem;
          }

          .info-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .form-section {
            padding: 1.5rem;
          }

          .form-header h2 {
            font-size: 1.6rem;
          }

          .department-card {
            padding: 1.5rem;
          }

          .map-container {
            height: 350px;
          }
        }

        @media (max-width: 480px) {
          .hero-content h1 {
            font-size: 1.9rem;
          }

          .form-group input,
          .form-group textarea {
            padding: 0.9rem 1rem;
            font-size: 0.9rem;
          }

          .submit-btn {
            padding: 1rem 1.8rem;
            font-size: 0.95rem;
          }

          .info-card {
            padding: 2rem 1.2rem;
          }

          .dept-icon {
            width: 45px;
            height: 45px;
          }

          .faq-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
        </div>
    );
};

export default ContactUs;