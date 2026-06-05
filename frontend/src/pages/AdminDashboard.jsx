import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import Topbar from '../components/Topbar';
import Loader from '../components/Loader';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersRes, tradesRes] = await Promise.all([
          axiosInstance.get('/admin/users'),
          axiosInstance.get('/admin/trades')
        ]);
        setUsers(usersRes.data);
        setTrades(tradesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'admin') fetchAdminData();
  }, [user]);

  const toggleBan = async (id) => {
    try {
      const res = await axiosInstance.put(`/admin/users/${id}/ban`);
      setUsers(users.map(u => u._id === id ? { ...u, isActive: res.data.isActive } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  if (user?.role !== 'admin') {
    return <div style={{ padding: 40, textAlign: 'center' }}>Not authorized as admin.</div>;
  }

  return (
    <div className="page-fade">
      <Topbar title="Admin Dashboard" />
      <div className="page-content">
        
        <div className="grid-2 mb-24">
          <div className="stat-card purple">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{users.length}</div>
          </div>
          <div className="stat-card teal">
            <div className="stat-label">Total Trades Initiated</div>
            <div className="stat-value">{trades.length}</div>
          </div>
        </div>

        <div className="card mb-24">
          <div className="section-title mb-16">User Management</div>
          {loading ? <Loader /> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 500 }}>{u.name}</td>
                      <td style={{ color: 'var(--muted)' }}>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-muted'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                          {u.isActive ? 'Active' : 'Banned'}
                        </span>
                      </td>
                      <td>
                        {u.role !== 'admin' && (
                          <button 
                            className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-success'}`}
                            onClick={() => toggleBan(u._id)}
                          >
                            {u.isActive ? 'Ban User' : 'Unban'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
