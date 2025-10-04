import React, { useState, useEffect } from 'react';
import { Search, Eye, ShoppingCart, X, Package } from 'lucide-react';
import { api } from '../../utils/api';
import { ENDPOINTS } from '../../utils/constants';

const OrdersView = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get(ENDPOINTS.ORDERS);
            if (response.success && response.data) {
                const formattedOrders = response.data.map(order => ({
                    id: order.id,
                    customerName: order.user
                        ? `${order.user.first_name} ${order.user.last_name}`
                        : order.shipping_first_name + ' ' + order.shipping_last_name || 'Guest',
                    total: parseFloat(order.total || 0),
                    itemCount: order.items?.length || 0,
                    status: order.status || 'pending',
                    date: order.created_at || order.createdAt,
                    items: order.items || []
                }));
                setOrders(formattedOrders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };


    const updateOrderStatus = async (orderId, status) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status });  // ← Remove /api
            fetchOrders();
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order status');
        }
    };

    const viewOrderDetails = async (orderId) => {
        try {
            const response = await api.get(`/orders/${orderId}`);  // ← Remove /api
            if (response.success && response.data) {
                setSelectedOrder(response.data);
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            alert('Failed to load order details');
        }
    };


    const getStatusColor = (status) => {
        const colors = {
            pending: { bg: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)', color: '#856404', border: '#ffc107' },
            processing: { bg: 'linear-gradient(135deg, #cfe2ff 0%, #a8d5ff 100%)', color: '#084298', border: '#0d6efd' },
            shipped: { bg: 'linear-gradient(135deg, #d1ecf1 0%, #a8e6f0 100%)', color: '#0c5460', border: '#0dcaf0' },
            delivered: { bg: 'linear-gradient(135deg, #d4edda 0%, #b3e5c5 100%)', color: '#155724', border: '#28a745' },
            cancelled: { bg: 'linear-gradient(135deg, #f8d7da 0%, #f5b7bd 100%)', color: '#721c24', border: '#dc3545' }
        };
        return colors[status] || colors.pending;
    };

    const filteredOrders = orders.filter(order => {
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
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
    };

    return (
        <div className="orders-view">
            <div className="view-header">
                <h2>Order Management</h2>
                <p>Track and manage all customer orders</p>
            </div>

            <div className="data-table-container">
                <div className="table-header">
                    <div className="search-box">
                        <Search size={20} />
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
                            <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                            <span className="count">{count}</span>
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Loading orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="no-data">
                        <ShoppingCart size={64} color="#ccc" />
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
                            {filteredOrders.map((order, index) => {
                                const statusStyle = getStatusColor(order.status);
                                return (
                                    <tr key={order.id} style={{ animationDelay: `${index * 0.05}s` }}>
                                        <td className="order-id">#{order.id}</td>
                                        <td className="customer-name">{order.customerName}</td>
                                        <td className="total">${order.total.toFixed(2)}</td>
                                        <td className="items-count">{order.itemCount} items</td>
                                        <td>
                                                <span
                                                    className="status-badge"
                                                    style={{
                                                        background: statusStyle.bg,
                                                        color: statusStyle.color,
                                                        borderColor: statusStyle.border
                                                    }}
                                                >
                                                    {order.status}
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
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                <button
                                                    className="icon-btn view"
                                                    onClick={() => viewOrderDetails(order.id)}
                                                    title="View details"
                                                >
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

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Order #{selectedOrder.id}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="order-info-grid">
                                <div className="info-section">
                                    <h3>Customer Information</h3>
                                    <p><strong>Name:</strong> {selectedOrder.shipping_first_name} {selectedOrder.shipping_last_name}</p>
                                    <p><strong>Email:</strong> {selectedOrder.shipping_email}</p>
                                    <p><strong>Phone:</strong> {selectedOrder.shipping_phone}</p>
                                </div>

                                <div className="info-section">
                                    <h3>Shipping Address</h3>
                                    <p>{selectedOrder.shipping_address}</p>
                                    <p>{selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_postal_code}</p>
                                    <p>{selectedOrder.shipping_country}</p>
                                </div>
                            </div>

                            <div className="items-section">
                                <h3>Order Items</h3>
                                <div className="items-list">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="item-card">
                                            <Package size={20} />
                                            <div className="item-details">
                                                <p className="item-name">{item.product_name}</p>
                                                <p className="item-qty">Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}</p>
                                            </div>
                                            <p className="item-total">${parseFloat(item.total).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="order-summary">
                                <div className="summary-row">
                                    <span>Subtotal:</span>
                                    <span>${parseFloat(selectedOrder.subtotal).toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping:</span>
                                    <span>${parseFloat(selectedOrder.shipping_cost).toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Tax:</span>
                                    <span>${parseFloat(selectedOrder.tax).toFixed(2)}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total:</span>
                                    <span>${parseFloat(selectedOrder.total).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

                .orders-view {
                    animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: 'Poppins', sans-serif;
                }

                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .view-header { margin-bottom: 30px; }
                .view-header h2 { font-size: 28px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; }
                .view-header p { color: #666; font-size: 15px; }

                .data-table-container {
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    overflow: hidden;
                }

                .table-header { padding: 25px; border-bottom: 2px solid #f0f0f0; }

                .search-box {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: #fff;
                    padding: 14px 18px;
                    border-radius: 12px;
                    border: 2px solid #e0e0e0;
                    max-width: 500px;
                    transition: all 0.3s;
                }

                .search-box:focus-within {
                    border-color: #FFD700;
                    box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.1);
                }

                .search-box input {
                    border: none;
                    flex: 1;
                    outline: none;
                    font-size: 15px;
                    font-family: 'Poppins', sans-serif;
                }

                .status-filters {
                    display: flex;
                    gap: 12px;
                    padding: 25px;
                    flex-wrap: wrap;
                    background: #fafafa;
                }

                .filter-btn {
                    padding: 12px 20px;
                    border: 2px solid #e0e0e0;
                    background: #fff;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    font-family: 'Poppins', sans-serif;
                    display: flex;
                    gap: 10px;
                    transition: all 0.3s;
                }

                .filter-btn:hover { border-color: #FFD700; transform: translateY(-2px); }
                .filter-btn.active {
                    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                    color: #000;
                    border-color: #FFD700;
                }

                .filter-btn .count {
                    background: rgba(0, 0, 0, 0.1);
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 12px;
                }

                .loading {
                    text-align: center;
                    padding: 80px 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }

                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid #f0f0f0;
                    border-top: 4px solid #FFD700;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin { to { transform: rotate(360deg); } }

                .no-data { text-align: center; padding: 80px 20px; }

                .table-wrapper { overflow-x: auto; }
                .data-table { width: 100%; border-collapse: collapse; }
                .data-table thead tr { background: linear-gradient(135deg, #1a1a1a 0%, #000 100%); }
                .data-table th {
                    padding: 18px 20px;
                    text-align: left;
                    font-weight: 600;
                    color: #FFD700;
                    font-size: 13px;
                    text-transform: uppercase;
                }

                .data-table tbody tr {
                    border-bottom: 1px solid #f0f0f0;
                    animation: fadeInRow 0.5s ease-out backwards;
                }

                @keyframes fadeInRow {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                .data-table tbody tr:hover {
                    background: linear-gradient(90deg, rgba(255, 215, 0, 0.05) 0%, transparent 100%);
                }

                .data-table td { padding: 20px; color: #666; font-size: 14px; }
                .order-id { font-weight: 700; color: #000; font-size: 15px; }
                .customer-name { font-weight: 600; color: #333; }
                .total { font-weight: 700; color: #4CAF50; font-size: 17px; }
                .items-count { color: #666; font-weight: 500; }
                .date { color: #999; font-size: 13px; }

                .status-badge {
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: capitalize;
                    display: inline-block;
                    border: 2px solid;
                }

                .action-controls { display: flex; gap: 10px; align-items: center; }

                .status-select {
                    padding: 8px 12px;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 13px;
                    font-family: 'Poppins', sans-serif;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .status-select:hover { border-color: #FFD700; }
                .status-select:focus { outline: none; border-color: #FFD700; box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1); }

                .icon-btn {
                    background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
                    border: 2px solid #e0e0e0;
                    padding: 10px;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all 0.3s;
                    display: flex;
                }

                .icon-btn:hover {
                    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                    border-color: #FFD700;
                    transform: scale(1.1);
                    color: #000;
                }

                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    animation: fadeIn 0.3s;
                }

                .modal-content {
                    background: #fff;
                    border-radius: 16px;
                    max-width: 800px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: slideUp 0.3s;
                }

                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .modal-header {
                    padding: 25px;
                    border-bottom: 2px solid #f0f0f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
                    color: #FFD700;
                }

                .modal-header h2 { margin: 0; font-size: 24px; }
                .close-btn { background: none; border: none; color: #FFD700; cursor: pointer; padding: 5px; }
                .close-btn:hover { transform: scale(1.1); }

                .modal-body { padding: 25px; }

                .order-info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .info-section {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 12px;
                }

                .info-section h3 {
                    font-size: 16px;
                    margin-bottom: 15px;
                    color: #000;
                    font-weight: 700;
                }

                .info-section p { margin: 8px 0; font-size: 14px; color: #666; }

                .items-section { margin-bottom: 30px; }
                .items-section h3 {
                    font-size: 18px;
                    margin-bottom: 15px;
                    color: #000;
                    font-weight: 700;
                }

                .items-list { display: flex; flex-direction: column; gap: 12px; }

                .item-card {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 12px;
                    border-left: 4px solid #FFD700;
                }

                .item-details { flex: 1; }
                .item-name { font-weight: 600; color: #000; margin-bottom: 5px; }
                .item-qty { font-size: 13px; color: #666; }
                .item-total { font-weight: 700; color: #4CAF50; font-size: 16px; }

                .order-summary {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 12px;
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    font-size: 15px;
                }

                .summary-row.total {
                    border-top: 2px solid #FFD700;
                    margin-top: 10px;
                    padding-top: 15px;
                    font-size: 20px;
                    font-weight: 700;
                    color: #000;
                }

                @media (max-width: 768px) {
                    .order-info-grid { grid-template-columns: 1fr; }
                    .action-controls { flex-direction: column; gap: 6px; }
                }
            `}</style>
        </div>
    );
};

export default OrdersView;