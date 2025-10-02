import React, { useState, useEffect } from 'react';
import { Search, Eye, Download } from 'lucide-react';
import { api } from '../../utils/api';
import { ENDPOINTS } from '../../utils/constants';

const OrdersView = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await api.get(ENDPOINTS.ORDERS);
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await api.put(ENDPOINTS.ORDER_STATUS(orderId), { status });
            fetchOrders();
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order status');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: { bg: '#fff3cd', color: '#856404' },
            processing: { bg: '#cfe2ff', color: '#084298' },
            shipped: { bg: '#d1ecf1', color: '#0c5460' },
            completed: { bg: '#d4edda', color: '#155724' },
            cancelled: { bg: '#f8d7da', color: '#721c24' }
        };
        return colors[status] || colors.pending;
    };

    const filteredOrders = orders
        .filter(order => {
            const matchesSearch =
                order.id?.toString().includes(searchTerm) ||
                order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
            return matchesSearch && matchesStatus;
        });

    const statusCounts = {
        all: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        completed: orders.filter(o => o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
    };

    return (
        <div className="orders-view">
            <div className="data-table-container">
                <div className="table-header">
                    <div className="search-box">
                        <Search size={20} color="#666" />
                        <input
                            type="text"
                            placeholder="Search by order ID or customer name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="status-filters">
                    {Object.entries(statusCounts).map(([status, count]) => (
                        <button
                            key={status}
                            className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                            onClick={() => setFilterStatus(status)}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            <span className="count">{count}</span>
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="loading">Loading orders...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="no-data">
                        <p>No orders found</p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Items</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredOrders.map(order => {
                                const statusStyle = getStatusColor(order.status);
                                return (
                                    <tr key={order.id}>
                                        <td className="order-id">#{order.id}</td>
                                        <td className="customer-name">{order.customerName || 'N/A'}</td>
                                        <td className="total">${(order.total || 0).toFixed(2)}</td>
                                        <td>{order.itemCount || 0} items</td>
                                        <td>
                        <span
                            className="status-badge"
                            style={{
                                background: statusStyle.bg,
                                color: statusStyle.color
                            }}
                        >
                          {order.status || 'pending'}
                        </span>
                                        </td>
                                        <td className="date">
                                            {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td>
                                            <div className="action-controls">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    className="status-select"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                <button className="icon-btn view" title="View details">
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style>{`
        .orders-view {
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .data-table-container {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .table-header {
          padding: 20px;
          border-bottom: 1px solid #eee;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f5f5f5;
          padding: 10px 15px;
          border-radius: 8px;
          max-width: 500px;
        }

        .search-box input {
          border: none;
          background: none;
          flex: 1;
          outline: none;
          font-size: 14px;
        }

        .status-filters {
          display: flex;
          gap: 10px;
          padding: 20px;
          border-bottom: 1px solid #eee;
          overflow-x: auto;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 8px 16px;
          border: 2px solid #e0e0e0;
          background: #fff;
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #666;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .filter-btn:hover {
          border-color: #FFD700;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          color: #000;
          border-color: #FFD700;
        }

        .filter-btn .count {
          background: rgba(0,0,0,0.1);
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
        }

        .filter-btn.active .count {
          background: rgba(0,0,0,0.2);
        }

        .loading, .no-data {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          background: #f8f9fa;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #eee;
          white-space: nowrap;
        }

        .data-table td {
          padding: 15px;
          border-bottom: 1px solid #eee;
          color: #666;
        }

        .data-table tr:hover {
          background: #f8f9fa;
        }

        .order-id {
          font-weight: 600;
          color: #1a1a1a;
        }

        .customer-name {
          font-weight: 500;
          color: #333;
        }

        .total {
          font-weight: 600;
          color: #4CAF50;
          font-size: 16px;
        }

        .date {
          color: #999;
          font-size: 14px;
        }

        .status-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
          display: inline-block;
        }

        .action-controls {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .status-select {
          padding: 6px 10px;
          border: 2px solid #eee;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .status-select:hover {
          border-color: #FFD700;
        }

        .status-select:focus {
          outline: none;
          border-color: #FFD700;
        }

        .icon-btn {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-btn:hover {
          background: #f0f0f0;
          transform: scale(1.1);
        }

        .icon-btn.view { color: #2196F3; }

        @media (max-width: 768px) {
          .search-box {
            max-width: 100%;
          }

          .status-filters {
            overflow-x: auto;
            flex-wrap: nowrap;
          }

          .data-table {
            font-size: 14px;
          }

          .data-table th,
          .data-table td {
            padding: 10px;
          }

          .action-controls {
            flex-direction: column;
          }
        }
      `}</style>
        </div>
    );
};

export default OrdersView;