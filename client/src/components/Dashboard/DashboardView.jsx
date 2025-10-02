import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, Grid, DollarSign, TrendingUp, Users } from 'lucide-react';
import { api } from '../../utils/api';
import { ENDPOINTS } from '../../utils/constants';

const DashboardView = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalCategories: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        totalCustomers: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const data = await api.get(ENDPOINTS.STATS);
            setStats(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setError('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Products',
            value: stats.totalProducts || 0,
            icon: Package,
            color: '#4CAF50',
            bgColor: 'rgba(76, 175, 80, 0.1)'
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders || 0,
            icon: ShoppingCart,
            color: '#2196F3',
            bgColor: 'rgba(33, 150, 243, 0.1)'
        },
        {
            title: 'Categories',
            value: stats.totalCategories || 0,
            icon: Grid,
            color: '#FF9800',
            bgColor: 'rgba(255, 152, 0, 0.1)'
        },
        {
            title: 'Total Revenue',
            value: `$${(stats.totalRevenue || 0).toLocaleString()}`,
            icon: DollarSign,
            color: '#FFD700',
            bgColor: 'rgba(255, 215, 0, 0.1)'
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders || 0,
            icon: TrendingUp,
            color: '#f44336',
            bgColor: 'rgba(244, 67, 54, 0.1)'
        },
        {
            title: 'Total Customers',
            value: stats.totalCustomers || 0,
            icon: Users,
            color: '#9C27B0',
            bgColor: 'rgba(156, 39, 176, 0.1)'
        }
    ];

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Loading dashboard...</p>
                <style>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 400px;
            gap: 20px;
          }

          .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #FFD700;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <button onClick={fetchDashboardStats} className="retry-btn">
                    Retry
                </button>
                <style>{`
          .error-container {
            text-align: center;
            padding: 40px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }

          .error-container p {
            color: #f44336;
            margin-bottom: 20px;
            font-size: 16px;
          }

          .retry-btn {
            padding: 10px 24px;
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
            color: #000;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
          }
        `}</style>
            </div>
        );
    }

    return (
        <div className="dashboard-view">
            <div className="dashboard-header">
                <h2>Overview</h2>
                <p>Welcome to your admin dashboard</p>
            </div>

            <div className="dashboard-cards">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div key={index} className="stat-card">
                            <div className="stat-icon" style={{
                                background: card.bgColor,
                                color: card.color
                            }}>
                                <Icon size={28} />
                            </div>
                            <div className="stat-content">
                                <h3>{card.title}</h3>
                                <div className="stat-value">{card.value}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="dashboard-info">
                <div className="info-card">
                    <h3>Quick Stats</h3>
                    <ul>
                        <li>
                            <span>Average Order Value:</span>
                            <strong>
                                ${stats.totalOrders > 0
                                ? (stats.totalRevenue / stats.totalOrders).toFixed(2)
                                : '0.00'}
                            </strong>
                        </li>
                        <li>
                            <span>Products per Category:</span>
                            <strong>
                                {stats.totalCategories > 0
                                    ? Math.round(stats.totalProducts / stats.totalCategories)
                                    : 0}
                            </strong>
                        </li>
                        <li>
                            <span>Order Completion Rate:</span>
                            <strong>
                                {stats.totalOrders > 0
                                    ? Math.round(((stats.totalOrders - stats.pendingOrders) / stats.totalOrders) * 100)
                                    : 0}%
                            </strong>
                        </li>
                    </ul>
                </div>
            </div>

            <style>{`
        .dashboard-view {
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dashboard-header {
          margin-bottom: 30px;
        }

        .dashboard-header h2 {
          font-size: 24px;
          color: #1a1a1a;
          margin-bottom: 5px;
        }

        .dashboard-header p {
          color: #666;
          font-size: 14px;
        }

        .dashboard-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-left: 4px solid #FFD700;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-content {
          flex: 1;
        }

        .stat-content h3 {
          color: #666;
          font-size: 14px;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #1a1a1a;
        }

        .dashboard-info {
          margin-top: 30px;
        }

        .info-card {
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .info-card h3 {
          color: #1a1a1a;
          font-size: 20px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #FFD700;
        }

        .info-card ul {
          list-style: none;
        }

        .info-card li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .info-card li:last-child {
          border-bottom: none;
        }

        .info-card li span {
          color: #666;
          font-size: 15px;
        }

        .info-card li strong {
          color: #1a1a1a;
          font-size: 18px;
        }

        @media (max-width: 768px) {
          .dashboard-cards {
            grid-template-columns: 1fr;
          }

          .stat-card {
            padding: 20px;
          }

          .stat-value {
            font-size: 28px;
          }
        }
      `}</style>
        </div>
    );
};

export default DashboardView;