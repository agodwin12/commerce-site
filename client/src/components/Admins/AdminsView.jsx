import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Shield, User } from 'lucide-react';
import { api } from '../../utils/api';
import { ENDPOINTS } from '../../utils/constants';
import AdminModal from './AdminModal';

const AdminsView = () => {
    const [admins, setAdmins] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const data = await api.get(ENDPOINTS.ADMIN_USERS);
            setAdmins(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching admins:', error);
            setAdmins([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this administrator? This action cannot be undone.')) {
            try {
                await api.delete(ENDPOINTS.ADMIN_USER_BY_ID(id));
                fetchAdmins();
            } catch (error) {
                console.error('Error deleting admin:', error);
                alert('Failed to delete administrator');
            }
        }
    };

    const handleAddNew = () => {
        setEditingAdmin(null);
        setShowModal(true);
    };

    const handleEdit = (admin) => {
        setEditingAdmin(admin);
        setShowModal(true);
    };

    return (
        <div className="admins-view">
            <div className="data-table-container">
                <div className="table-header">
                    <div className="header-info">
                        <h3>Manage Administrators</h3>
                        <p>Control access to the admin panel</p>
                    </div>
                    <button className="add-btn" onClick={handleAddNew}>
                        <Plus size={20} />
                        <span>Add Admin</span>
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Loading administrators...</div>
                ) : admins.length === 0 ? (
                    <div className="no-data">
                        <Shield size={64} color="#ccc" />
                        <p>No administrators yet</p>
                        <button className="add-btn-secondary" onClick={handleAddNew}>
                            Add your first administrator
                        </button>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {admins.map(admin => (
                                <tr key={admin.id}>
                                    <td className="admin-id">#{admin.id}</td>
                                    <td>
                                        <div className="admin-info">
                                            <div className="admin-avatar">
                                                <User size={20} />
                                            </div>
                                            <span className="admin-name">{admin.name}</span>
                                        </div>
                                    </td>
                                    <td className="email">{admin.email}</td>
                                    <td>
                      <span className={`role-badge ${admin.role === 'super_admin' ? 'super' : 'regular'}`}>
                        {admin.role === 'super_admin' ? (
                            <>
                                <Shield size={14} />
                                <span>Super Admin</span>
                            </>
                        ) : (
                            <>
                                <User size={14} />
                                <span>Admin</span>
                            </>
                        )}
                      </span>
                                    </td>
                                    <td className="date">
                                        {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td>
                                        <div className="action-btns">
                                            <button
                                                className="icon-btn edit"
                                                onClick={() => handleEdit(admin)}
                                                title="Edit administrator"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                className="icon-btn delete"
                                                onClick={() => handleDelete(admin.id)}
                                                title="Delete administrator"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <AdminModal
                    admin={editingAdmin}
                    onClose={() => setShowModal(false)}
                    onSave={() => {
                        setShowModal(false);
                        fetchAdmins();
                    }}
                />
            )}

            <style>{`
        .admins-view {
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
          padding: 25px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .header-info h3 {
          font-size: 22px;
          color: #1a1a1a;
          margin: 0 0 5px 0;
        }

        .header-info p {
          color: #666;
          font-size: 14px;
          margin: 0;
        }

        .add-btn {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          color: #000;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
        }

        .loading {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .no-data {
          text-align: center;
          padding: 80px 20px;
          color: #666;
        }

        .no-data p {
          margin: 20px 0;
          font-size: 18px;
          color: #999;
        }

        .add-btn-secondary {
          background: #f0f0f0;
          color: #333;
          border: 2px dashed #ccc;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .add-btn-secondary:hover {
          background: #e8e8e8;
          border-color: #FFD700;
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

        .admin-id {
          font-weight: 600;
          color: #1a1a1a;
        }

        .admin-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
        }

        .admin-name {
          font-weight: 600;
          color: #1a1a1a;
        }

        .email {
          color: #666;
          font-size: 14px;
        }

        .role-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .role-badge.super {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          color: #000;
        }

        .role-badge.regular {
          background: #e3f2fd;
          color: #1976d2;
        }

        .date {
          color: #999;
          font-size: 14px;
        }

        .action-btns {
          display: flex;
          gap: 8px;
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

        .icon-btn.edit { 
          color: #4CAF50; 
        }
        
        .icon-btn.delete { 
          color: #f44336; 
        }

        @media (max-width: 768px) {
          .table-header {
            flex-direction: column;
            align-items: stretch;
          }

          .add-btn {
            justify-content: center;
          }

          .data-table {
            font-size: 14px;
          }

          .data-table th,
          .data-table td {
            padding: 10px;
          }
        }
      `}</style>
        </div>
    )
};

export default AdminsView;