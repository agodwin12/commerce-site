import React, { useState } from 'react';
import { api } from '../../utils/api';

const LoginPage = ({ setIsLoggedIn, setAdminData }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.login(email, password);

            // Check if response is successful
            if (response.success && response.data) {
                const { user, token } = response.data;

                // Check if user has admin role
                if (user.role !== 'admin' && user.role !== 'super_admin') {
                    setError('Access denied. Admin privileges required.');
                    setLoading(false);
                    return;
                }

                // Store token and set logged in state
                localStorage.setItem('adminToken', token);
                setAdminData(user);
                setIsLoggedIn(true);
            } else {
                setError(response.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            setError(error.message || 'Connection error. Please make sure the backend server is running.');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="logo">⚡</div>
                <h2>Admin Login</h2>
                <p className="subtitle">E-Commerce Admin Panel</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            required
                            disabled={loading}
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login to Dashboard'}
                    </button>
                </form>
            </div>

            <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
          padding: 20px;
        }

        .login-container {
          background: #fff;
          padding: 50px 40px;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
          max-width: 420px;
          width: 100%;
        }

        .logo {
          text-align: center;
          font-size: 64px;
          margin-bottom: 10px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        h2 {
          text-align: center;
          margin-bottom: 8px;
          color: #1a1a1a;
          font-size: 28px;
        }

        .subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 30px;
          font-size: 14px;
        }

        .error-message {
          color: #d32f2f;
          margin-bottom: 20px;
          text-align: center;
          padding: 12px;
          background: #ffebee;
          border-radius: 8px;
          border-left: 4px solid #d32f2f;
          font-size: 14px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .form-group input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #FFD700;
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
        }

        .form-group input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .btn-login {
          width: 100%;
          padding: 14px 24px;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          color: #000;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 16px;
          transition: all 0.3s ease;
          margin-top: 10px;
        }

        .btn-login:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
        }

        .btn-login:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-login:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .login-container {
            padding: 40px 30px;
          }

          .logo {
            font-size: 48px;
          }

          h2 {
            font-size: 24px;
          }
        }
      `}</style>
        </div>
    );
};

export default LoginPage;