import React from 'react';
import { Grid, Package, ShoppingCart, Users, LogOut, X } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, onLogout }) => {
    const menuItems = [
        { id: 'dashboard', icon: Grid, label: 'Dashboard' },
        { id: 'products', icon: Package, label: 'Products' },
        { id: 'categories', icon: Grid, label: 'Categories' },
        { id: 'orders', icon: ShoppingCart, label: 'Orders' },
        { id: 'admins', icon: Users, label: 'Admins' }
    ];

    return (
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <h2>⚡ Admin Panel</h2>
                <button onClick={() => setSidebarOpen(false)} className="toggle-btn">
                    <X size={20} />
                </button>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map(item => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <button onClick={onLogout} className="logout-btn">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            <style>{`
                .sidebar {
                    width: 280px;
                    background: linear-gradient(180deg, #1a1a1a 0%, #000 100%);
                    color: #fff;
                    position: fixed;
                    left: 0;
                    top: 0;
                    height: 100vh;
                    z-index: 1000;
                    display: flex;
                    flex-direction: column;
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                    box-shadow: 2px 0 20px rgba(0,0,0,0.5);
                }

                .sidebar.open {
                    transform: translateX(0);
                }

                .sidebar-header {
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(255, 215, 0, 0.2);
                    min-height: 70px;
                }

                .sidebar-header h2 {
                    color: #FFD700;
                    font-size: 20px;
                    margin: 0;
                    font-weight: 700;
                }

                .toggle-btn {
                    background: none;
                    border: none;
                    color: #FFD700;
                    cursor: pointer;
                    padding: 5px;
                    display: flex;
                }

                .toggle-btn:hover {
                    transform: scale(1.1);
                }

                .sidebar-nav {
                    padding: 20px 0;
                    flex: 1;
                    overflow-y: auto;
                }

                .nav-item {
                    width: 100%;
                    padding: 15px 20px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    background: none;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    font-size: 16px;
                    border-left: 3px solid transparent;
                    text-align: left;
                    transition: all 0.3s;
                }

                .nav-item:hover {
                    background: rgba(255, 215, 0, 0.1);
                    border-left-color: #FFD700;
                }

                .nav-item.active {
                    background: rgba(255, 215, 0, 0.2);
                    border-left-color: #FFD700;
                    color: #FFD700;
                }

                .sidebar-footer {
                    padding: 20px;
                    border-top: 1px solid rgba(255, 215, 0, 0.2);
                }

                .logout-btn {
                    width: 100%;
                    padding: 15px 20px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    background: rgba(255, 0, 0, 0.1);
                    border: 1px solid rgba(255, 0, 0, 0.3);
                    color: #ff4444;
                    cursor: pointer;
                    border-radius: 8px;
                    font-size: 16px;
                    transition: all 0.3s;
                }

                .logout-btn:hover {
                    background: rgba(255, 0, 0, 0.2);
                }
            `}</style>
        </aside>
    );
};

export default Sidebar;