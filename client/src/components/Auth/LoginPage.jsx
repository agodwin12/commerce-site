// src/components/Auth/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { api } from '../../utils/api';
import { ENDPOINTS } from '../../utils/constants';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleLoginChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleRegisterChange = (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('Attempting login with:', loginData.email);
            const response = await api.post(`${ENDPOINTS.AUTH}/login`, {
                email: loginData.email,
                password: loginData.password
            });

            console.log('Login response:', response);

            if (response.success && response.data) {
                const { user, token } = response.data;

                console.log('User:', user);
                console.log('Token:', token);

                // Store credentials
                localStorage.setItem('adminToken', token);
                localStorage.setItem('user', JSON.stringify(user));

                // Force redirect using window.location for reliability
                const redirectPath = (user.role === 'admin' || user.role === 'super_admin')
                    ? '/admin/products'
                    : '/';

                console.log('Redirecting to:', redirectPath);

                // Use window.location for a hard redirect
                navigate(redirectPath, { replace: true });
            } else {
                setError(response.message || 'Login failed. Please check your credentials.');
                setLoading(false);
            }
        } catch (error) {
            setError(error.message || 'Login failed. Please try again.');
            console.error('Login error:', error);
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (registerData.password !== registerData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (registerData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            console.log('Attempting registration for:', registerData.email);
            const response = await api.post(`${ENDPOINTS.AUTH}/register`, {
                first_name: registerData.firstName,
                last_name: registerData.lastName,
                email: registerData.email,
                phone: registerData.phone,
                password: registerData.password
            });

            console.log('Registration response:', response);

            if (response.success && response.data) {
                const { user, token } = response.data;

                // Store credentials
                localStorage.setItem('adminToken', token);
                localStorage.setItem('user', JSON.stringify(user));

                console.log('Registration successful, redirecting to home');

                // Use window.location for a hard redirect
                window.location.href = '/';
            } else {
                setError(response.message || 'Registration failed. Please try again.');
                setLoading(false);
            }
        } catch (error) {
            setError(error.message || 'Registration failed. Please try again.');
            console.error('Register error:', error);
            setLoading(false);
        }
    };

    return (
        <>
            <div className="login-page">
                <div className="login-background">
                    <div className="background-pattern"></div>
                </div>

                <div className="login-container">
                    <div className="login-header">
                        <div className="logo" onClick={() => navigate('/')}>
                            <h1>Powersynth Labs<span className="gold">+</span></h1>
                        </div>
                        <p className="welcome-text">
                            {isLogin ? 'Welcome back!' : 'Create your account'}
                        </p>
                    </div>

                    <div className="form-container">
                        <div className="tab-switcher">
                            <button
                                className={`tab ${isLogin ? 'active' : ''}`}
                                onClick={() => {
                                    setIsLogin(true);
                                    setError('');
                                }}
                            >
                                Login
                            </button>
                            <button
                                className={`tab ${!isLogin ? 'active' : ''}`}
                                onClick={() => {
                                    setIsLogin(false);
                                    setError('');
                                }}
                            >
                                Register
                            </button>
                            <div className={`tab-indicator ${!isLogin ? 'right' : ''}`}></div>
                        </div>

                        {error && (
                            <div className="error-message">
                                <span>{error}</span>
                            </div>
                        )}

                        {isLogin ? (
                            <form onSubmit={handleLogin} className="auth-form">
                                <div className="form-group">
                                    <label>
                                        <Mail size={18} />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={loginData.email}
                                        onChange={handleLoginChange}
                                        placeholder="your@email.com"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        <Lock size={18} />
                                        Password
                                    </label>
                                    <div className="password-input">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={loginData.password}
                                            onChange={handleLoginChange}
                                            placeholder="Enter your password"
                                            required
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            className="toggle-password"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <div className="button-spinner"></div>
                                            Logging in...
                                        </>
                                    ) : (
                                        'LOGIN'
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister} className="auth-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>
                                            <User size={18} />
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={registerData.firstName}
                                            onChange={handleRegisterChange}
                                            placeholder="John"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <User size={18} />
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={registerData.lastName}
                                            onChange={handleRegisterChange}
                                            placeholder="Doe"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>
                                        <Mail size={18} />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={registerData.email}
                                        onChange={handleRegisterChange}
                                        placeholder="your@email.com"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        <Phone size={18} />
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={registerData.phone}
                                        onChange={handleRegisterChange}
                                        placeholder="+1 234 567 8900"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        <Lock size={18} />
                                        Password
                                    </label>
                                    <div className="password-input">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={registerData.password}
                                            onChange={handleRegisterChange}
                                            placeholder="Min. 6 characters"
                                            required
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            className="toggle-password"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>
                                        <Lock size={18} />
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={registerData.confirmPassword}
                                        onChange={handleRegisterChange}
                                        placeholder="Confirm your password"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <div className="button-spinner"></div>
                                            Creating account...
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </form>
                        )}

                        <div className="footer-text">
                            <button className="guest-btn" onClick={() => navigate('/')}>
                                Continue as Guest
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

                /* Remove default body margins */
                body {
                    margin: 0;
                    padding: 0;
                    overflow-x: hidden;
                }

                .login-page {
                    min-height: 100vh;
                    width: 100vw;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #0F0F0F;
                    padding: 2rem;
                    font-family: 'Poppins', sans-serif;
                    position: relative;
                    margin: 0;
                    box-sizing: border-box;
                }

                .login-background {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                }

                .background-pattern {
                    position: absolute;
                    inset: 0;
                    background-image: 
                        linear-gradient(rgba(212, 175, 55, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(212, 175, 55, 0.03) 1px, transparent 1px);
                    background-size: 50px 50px;
                    animation: patternMove 20s linear infinite;
                }

                @keyframes patternMove {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(50px, 50px); }
                }

                .login-container {
                    background: #1a1a1a;
                    border: 2px solid #2a2a2a;
                    border-radius: 24px;
                    padding: 3rem;
                    max-width: 500px;
                    width: 100%;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    position: relative;
                    z-index: 1;
                }

                .login-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .logo {
                    cursor: pointer;
                    margin-bottom: 1rem;
                }

                .logo h1 {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #fff;
                    margin: 0;
                    letter-spacing: 1px;
                }

                .logo .gold {
                    color: #D4AF37;
                    animation: pulse 2s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }

                .welcome-text {
                    color: #999;
                    font-size: 1.1rem;
                    margin: 0;
                }

                .form-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .tab-switcher {
                    display: flex;
                    position: relative;
                    background: #0F0F0F;
                    border-radius: 12px;
                    padding: 0.4rem;
                }

                .tab {
                    flex: 1;
                    padding: 0.9rem;
                    background: transparent;
                    border: none;
                    color: #999;
                    font-family: 'Poppins', sans-serif;
                    font-weight: 600;
                    font-size: 0.95rem;
                    cursor: pointer;
                    position: relative;
                    z-index: 2;
                    transition: color 0.3s;
                }

                .tab.active {
                    color: #0F0F0F;
                }

                .tab-indicator {
                    position: absolute;
                    width: calc(50% - 0.8rem);
                    height: calc(100% - 0.8rem);
                    background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
                    border-radius: 8px;
                    left: 0.4rem;
                    top: 0.4rem;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 1;
                }

                .tab-indicator.right {
                    transform: translateX(100%);
                }

                .error-message {
                    background: rgba(244, 67, 54, 0.1);
                    border: 1px solid rgba(244, 67, 54, 0.3);
                    border-radius: 12px;
                    padding: 1rem;
                    color: #f44336;
                    font-size: 0.9rem;
                    text-align: center;
                }

                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.6rem;
                }

                .form-group label {
                    color: #fff;
                    font-size: 0.9rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .form-group label svg {
                    color: #D4AF37;
                }

                .form-group input {
                    padding: 1rem 1.2rem;
                    background: #0F0F0F;
                    border: 2px solid #2a2a2a;
                    border-radius: 12px;
                    color: #fff;
                    font-family: 'Poppins', sans-serif;
                    font-size: 0.95rem;
                    transition: all 0.3s;
                }

                .form-group input::placeholder {
                    color: #555;
                }

                .form-group input:focus {
                    outline: none;
                    border-color: #D4AF37;
                    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
                }

                .form-group input:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .password-input {
                    position: relative;
                }

                .password-input input {
                    padding-right: 3rem;
                }

                .toggle-password {
                    position: absolute;
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: #999;
                    cursor: pointer;
                    padding: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: color 0.3s;
                }

                .toggle-password:hover {
                    color: #D4AF37;
                }

                .submit-btn {
                    padding: 1.2rem;
                    background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
                    border: none;
                    border-radius: 50px;
                    color: #0F0F0F;
                    font-family: 'Poppins', sans-serif;
                    font-weight: 800;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: all 0.4s;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.8rem;
                }

                .submit-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                    transition: left 0.6s;
                }

                .submit-btn:hover::before {
                    left: 100%;
                }

                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 40px rgba(212, 175, 55, 0.5);
                }

                .submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .button-spinner {
                    width: 18px;
                    height: 18px;
                    border: 3px solid rgba(15, 15, 15, 0.3);
                    border-top-color: #0F0F0F;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .footer-text {
                    text-align: center;
                    padding-top: 1rem;
                    border-top: 1px solid #2a2a2a;
                }

                .guest-btn {
                    background: none;
                    border: none;
                    color: #D4AF37;
                    font-family: 'Poppins', sans-serif;
                    font-weight: 600;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    text-decoration: underline;
                }

                .guest-btn:hover {
                    color: #F4D03F;
                }

                @media (max-width: 600px) {
                    .login-page {
                        padding: 1rem;
                    }

                    .login-container {
                        padding: 2rem 1.5rem;
                    }

                    .logo h1 {
                        font-size: 1.6rem;
                    }

                    .welcome-text {
                        font-size: 1rem;
                    }

                    .form-row {
                        grid-template-columns: 1fr;
                    }

                    .submit-btn {
                        font-size: 1rem;
                    }
                }
            `}</style>
        </>
    );
};

export default LoginPage;