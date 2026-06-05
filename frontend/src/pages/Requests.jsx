import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import Topbar from '../components/Topbar';
import Loader from '../components/Loader';

const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : 'U';
const getAvatarClass = (name) => {
  const classes = ['avatar-grad-1','avatar-grad-2','avatar-grad-3','avatar-grad-4','avatar-grad-5'];
  return classes[(name || 'U').charCodeAt(0) % classes.length];
};

const Requests = () => {
  const { user } = useContext(AuthContext);
  const [tab, setTab] = useState('received');
  const [requests, setRequests] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const [sentRes, receivedRes] = await Promise.all([
        axiosInstance.get('/trade/sent'),
        axiosInstance.get('/trade/received')
      ]);
      setRequests({ sent: sentRes.data, received: receivedRes.data });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) fetchRequests(); }, [user]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/trade/${id}`, { status });
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const currentRequests = requests[tab];

  return (
    <div className="page-fade">
      <Topbar title="Trade Requests" />
      <div className="page-content">
        <div className="tabs" style={{ maxWidth: 300 }}>
          <button className={`tab ${tab === 'received' ? 'active' : ''}`} onClick={() => setTab('received')}>
            Received ({requests.received.length})
          </button>
          <button className={`tab ${tab === 'sent' ? 'active' : ''}`} onClick={() => setTab('sent')}>
            Sent ({requests.sent.length})
          </button>
        </div>

        {loading ? <Loader /> : currentRequests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📬</div>
            <div className="empty-title">No Requests</div>
            <div className="empty-desc">You don't have any {tab} trade requests at the moment.</div>
          </div>
        ) : (
          <div className="flex-col gap-16">
            {currentRequests.map(req => {
              const otherUser = tab === 'received' ? req.senderId : req.receiverId;
              if (!otherUser) return null;
              
              return (
                <div key={req._id} className="request-card">
                  <div className={`avatar-md ${getAvatarClass(otherUser.name)}`} style={{ color: 'white' }}>
                    {otherUser.photo ? <img src={otherUser.photo} alt={otherUser.name} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} /> : getInitials(otherUser.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-12 mb-4">
                      <div style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700 }}>{otherUser.name}</div>
                      <div className={`status-${req.status}`}>{req.status.charAt(0).toUpperCase() + req.status.slice(1)}</div>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 8, padding: '8px 12px', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      "{req.message}"
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      <span style={{ color: 'var(--accent3)' }}>Offers: {req.skillOffered}</span> • <span style={{ color: 'var(--accent2)' }}>Wants: {req.skillWanted}</span>
                    </div>
                  </div>
                  {tab === 'received' && req.status === 'pending' && (
                    <div className="flex gap-8">
                      <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(req._id, 'accepted')}>Accept</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleUpdateStatus(req._id, 'rejected')}>Decline</button>
                    </div>
                  )}
                  {req.status === 'accepted' && (
                    <div className="flex gap-8">
                      <a href="/messages" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>Message</a>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleUpdateStatus(req._id, 'completed')}>Mark Complete</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
