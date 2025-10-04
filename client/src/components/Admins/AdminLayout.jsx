// src/components/Admin/AdminLayout.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "../Layout/Sidebar";

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");

    useEffect(() => {
        const checkAuth = () => {
            try {
                const token = localStorage.getItem("adminToken");
                const userStr = localStorage.getItem("user");

                if (!token) {
                    navigate("/login", { replace: true });
                    return;
                }

                if (userStr) {
                    const user = JSON.parse(userStr);
                    if (user.role !== "admin") {
                        navigate("/login", { replace: true });
                    }
                } else {
                    navigate("/login", { replace: true });
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                navigate("/login", { replace: true });
            }
        };

        checkAuth();
    }, [navigate]);

    useEffect(() => {
        if (location.pathname.includes("products")) setActiveTab("products");
        else if (location.pathname.includes("categories")) setActiveTab("categories");
        else if (location.pathname.includes("orders")) setActiveTab("orders");
        else if (location.pathname.includes("admins")) setActiveTab("admins");
        else setActiveTab("dashboard");
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`/admin/${tab}`, { replace: false });
        setSidebarOpen(false);
    };

    return (
        <>
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            <Sidebar
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onLogout={handleLogout}
            />

            <div className="admin-main">
                <header className="admin-header">
                    <button
                        className="menu-toggle-btn"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu size={24} />
                    </button>
                    <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                </header>
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>

            <style>{`
                html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100%;
                    overflow-x: hidden;
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                #root {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                }

                .sidebar-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.6);
                    z-index: 999;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .admin-main {
                    width: 100%;
                    min-height: 100vh;
                    background: #f5f6fa;
                    display: flex;
                    flex-direction: column;
                    margin: 0;
                    padding: 0;
                }

                .admin-header {
                    background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
                    color: #FFD700;
                    padding: 20px 30px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    width: 100%;
                }

                .menu-toggle-btn {
                    background: rgba(255, 215, 0, 0.1);
                    border: 1px solid rgba(255, 215, 0, 0.3);
                    border-radius: 8px;
                    color: #FFD700;
                    cursor: pointer;
                    padding: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                }

                .menu-toggle-btn:hover {
                    background: rgba(255, 215, 0, 0.2);
                    border-color: #FFD700;
                    transform: scale(1.05);
                }

                .admin-header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 700;
                    font-family: 'Poppins', sans-serif;
                }

                .admin-content {
                    flex: 1;
                    padding: 30px;
                    overflow-y: auto;
                    width: 100%;
                }

                @media (max-width: 968px) {
                    .admin-header {
                        padding: 15px 20px;
                    }

                    .admin-header h1 {
                        font-size: 22px;
                    }

                    .admin-content {
                        padding: 20px;
                    }
                }

                @media (max-width: 480px) {
                    .admin-header {
                        padding: 12px 15px;
                    }

                    .admin-header h1 {
                        font-size: 18px;
                    }

                    .admin-content {
                        padding: 15px;
                    }
                }
            `}</style>
        </>
    );
};

export default AdminLayout;