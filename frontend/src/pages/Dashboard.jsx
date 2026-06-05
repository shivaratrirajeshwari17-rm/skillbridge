import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Topbar from '../components/Topbar';
import SkillTag from '../components/SkillTag';
import axiosInstance from '../utils/axiosInstance';

const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : 'U';
const getAvatarClass = (name) => {
  const classes = ['avatar-grad-1','avatar-grad-2','avatar-grad-3','avatar-grad-4','avatar-grad-5'];
  return classes[(name || 'U').charCodeAt(0) % classes.length];
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ matches: 0, sent: 0, received: 0, messages: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [matchRes, sentRes, recvRes] = await Promise.all([
          axiosInstance.get('/match'),
          axiosInstance.get('/trade/sent'),
          axiosInstance.get('/trade/received'),
        ]);
        setStats({ matches: matchRes.data.length, sent: sentRes.data.length, received: recvRes.data.length, messages: 0 });
      } catch {}
    };
    if (user) fetchStats();
  }, [user]);

  const statCards = [
    { label: 'Matches Found', value: stats.matches, icon: '🤝', cls: 'purple', change: 'Based on your skills' },
    { label: 'Requests Sent', value: stats.sent, icon: '📤', cls: 'teal', change: 'Trades initiated' },
    { label: 'Requests Received', value: stats.received, icon: '📥', cls: 'amber', change: 'Awaiting response' },
    { label: 'Skill Points', value: (stats.sent + stats.received) * 10, icon: '⭐', cls: 'pink', change: 'Earned from trading' },
  ];

  const activity = [
    { dot: 'var(--accent)', text: <><strong>SkillBridge</strong> is live and ready for trading! 🎉</>, time: 'Just now' },
    { dot: 'var(--accent3)', text: 'Complete your profile to get better matches', time: '5m ago' },
    { dot: 'var(--accent4)', text: 'Add skills you offer and skills you want to learn', time: '5m ago' },
  ];

  return (
    <div className="page-fade">
      <Topbar title="Dashboard" />
      <div className="page-content">

        {/* Welcome */}
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.08), rgba(167,139,250,0.04))', border: '1px solid rgba(108,99,255,0.15)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div className={`avatar-xl ${getAvatarClass(user?.name)}`} style={{ color: 'white', flexShrink: 0 }}>
            {user?.photo ? <img src={user.photo} alt={user.name} style={{ width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%' }} /> : getInitials(user?.name)}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 14 }}>
              {user?.skillsOffered?.length ? `You're offering ${user.skillsOffered.length} skill(s) and seeking ${user.skillsWanted?.length || 0}.` : 'Complete your profile to start matching with other users.'}
            </div>
            {!user?.bio && (
              <a href="/edit-profile" className="btn btn-primary btn-sm" style={{ marginTop: 12, textDecoration: 'none' }}>Complete Profile →</a>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid-4 mb-24">
          {statCards.map(s => (
            <div key={s.label} className={`stat-card ${s.cls}`}>
              <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-change">{s.change}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          {/* Skills Preview */}
          <div className="card">
            <div className="section-header">
              <div>
                <div className="section-title">Your Skills</div>
                <div className="section-subtitle">Offered & Wanted</div>
              </div>
              <a href="/edit-profile" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>Edit</a>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>I Can Teach</div>
              <div className="skills-wrap">
                {user?.skillsOffered?.length ? user.skillsOffered.map((s, i) => <SkillTag key={i} skill={s} type="offered" />) : <span style={{ color: 'var(--muted2)', fontSize: 13 }}>No skills added yet</span>}
              </div>
            </div>
            <div className="divider" />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent2)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>I Want to Learn</div>
              <div className="skills-wrap">
                {user?.skillsWanted?.length ? user.skillsWanted.map((s, i) => <SkillTag key={i} skill={s} type="wanted" />) : <span style={{ color: 'var(--muted2)', fontSize: 13 }}>No skills added yet</span>}
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="card">
            <div className="section-header">
              <div>
                <div className="section-title">Recent Activity</div>
                <div className="section-subtitle">What's happening</div>
              </div>
            </div>
            {activity.map((a, i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot" style={{ background: a.dot }} />
                <div>
                  <div className="activity-text">{a.text}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
