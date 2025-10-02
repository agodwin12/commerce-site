import React from 'react';
import { Grid, Package, ShoppingCart, Users, LogOut, Menu, X } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, onLogout }) => {
    const menuItems = [
        { id: 'dashboard', icon: Grid, label: 'Dashboard' },
        { id: 'products', icon: Package, label: 'Products' },
        { id: 'categories', icon: Grid, label: 'Categories' },
        { id: 'orders', icon: ShoppingCart, label: 'Orders' },
        { id: 'admins', icon: Users, label: 'Admins' }
    ];

    return (
        <>
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    {sidebarOpen && <h2>⚡ Admin Panel</h2>}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="toggle-btn"
                        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
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
                                aria-label={item.label}
                            >
                                <Icon size={20} />
                                {sidebarOpen && <span>{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={onLogout} className="logout-btn" aria-label="Logout">
                        <LogOut size={20} />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            <style>{`
        .sidebar {
          width: 250px;
          background: linear-gradient(180deg, #1a1a1a 0%, #000 100%);
          color: #fff;
          transition: width 0.3s ease;
          position: fixed;
          height: 100vh;
          overflow-y: auto;
          z-index: 1000;
        }

        .sidebar.closed {
          width: 70px;
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
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .toggle-btn:hover {
          transform: scale(1.1);
        }

        .sidebar-nav {
          padding: 20px 0;
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
          transition: all 0.3s;
          font-size: 16px;
          border-left: 3px solid transparent;
          text-align: left;
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
          position: absolute;
          bottom: 20px;
          width: 100%;
          padding: 0 20px;
        }

        .logout-btn {
          width: calc(100% - 40px);
          padding: 15px 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid rgba(255, 0, 0, 0.3);
          color: #ff4444;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.3s;
          font-size: 16px;
        }

        .logout-btn:hover {
          background: rgba(255, 0, 0, 0.2);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 70px;
          }

          .sidebar-header h2 {
            display: none;
          }
        }
      `}</style>
        </>
    );
};

export default Sidebar;