import { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Topbar = ({ title }) => {
  const { user } = useContext(AuthContext);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const notifications = [
    { id: 1, icon: '🤝', text: <><strong>Alex Rivera</strong> matched your skills! React ↔ Figma</>, time: '2m ago', unread: true },
    { id: 2, icon: '📬', text: <><strong>Maria Chen</strong> accepted your trade request</>, time: '15m ago', unread: true },
    { id: 3, icon: '💬', text: <><strong>Jake Kim</strong> sent you a message</>, time: '1h ago', unread: false },
  ];

  return (
    <div className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="topbar-right">
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button className="topbar-btn" onClick={() => setShowNotif(v => !v)} id="notif-btn">
            🔔
            <span className="notif-dot" />
          </button>
          {showNotif && (
            <div className="notif-panel">
              <div className="notif-head">
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14 }}>Notifications</span>
                <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>Mark all read</button>
              </div>
              {notifications.map(n => (
                <div key={n.id} className={`notif-item${n.unread ? ' unread' : ''}`}>
                  <div className="notif-icon" style={{ background: n.unread ? 'rgba(108,99,255,0.12)' : 'var(--bg3)' }}>{n.icon}</div>
                  <div>
                    <div className="notif-text">{n.text}</div>
                    <div className="notif-ts">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {user && (
          <button className="topbar-btn" onClick={() => navigate('/profile')} title="Profile">👤</button>
        )}
      </div>
    </div>
  );
};

export default Topbar;
