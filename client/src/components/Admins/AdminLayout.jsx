// src/components/Admin/AdminLayout.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Layout/Sidebar"; // import your sidebar component

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("dashboard");

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!token || (user.role !== "admin" && user.role !== "super_admin")) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
    };

    // Sync activeTab with the URL
    useEffect(() => {
        if (location.pathname.includes("products")) setActiveTab("products");
        else if (location.pathname.includes("categories")) setActiveTab("categories");
        else if (location.pathname.includes("orders")) setActiveTab("orders");
        else if (location.pathname.includes("admins")) setActiveTab("admins");
        else setActiveTab("dashboard");
    }, [location.pathname]);

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={(tab) => {
                    setActiveTab(tab);
                    navigate(`/admin/${tab}`);
                }}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onLogout={handleLogout}
            />

            {/* Main content */}
            <div className="admin-main" style={{ marginLeft: sidebarOpen ? "250px" : "70px" }}>
                <header className="admin-header">
                    <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                </header>
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>

            <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #f5f6fa;
          font-family: 'Poppins', sans-serif;
        }
        .admin-main {
          flex: 1;
          transition: margin-left 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .admin-header {
          background: #fff;
          padding: 15px 20px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          font-weight: 600;
        }
        .admin-content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }
      `}</style>
        </div>
    );
};

export default AdminLayout;
