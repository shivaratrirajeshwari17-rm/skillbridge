import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : 'U';
const getAvatarClass = (name) => {
  const classes = ['avatar-grad-1','avatar-grad-2','avatar-grad-3','avatar-grad-4','avatar-grad-5'];
  const code = (name || 'U').charCodeAt(0);
  return classes[code % classes.length];
};

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const navItems = [
    { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { to: '/matches', icon: '🤝', label: 'Matches', badge: null },
    { to: '/requests', icon: '📬', label: 'Requests' },
    { to: '/messages', icon: '💬', label: 'Messages' },
  ];
  const accountItems = [
    { to: '/profile', icon: '👤', label: 'My Profile' },
    ...(user?.role === 'admin' ? [{ to: '/admin', icon: '🛡️', label: 'Admin Panel' }] : []),
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">SB</div>
          <div className="logo-text">Skill<span>Bridge</span></div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Explore</div>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </NavLink>
        ))}

        <div className="nav-section-label" style={{ marginTop: 8 }}>Account</div>
        {accountItems.map(item => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {user ? (
        <div className="sidebar-user" onClick={handleLogout} title="Click to logout">
          <div className={`user-avatar ${getAvatarClass(user.name)}`}>
            {user.photo ? <img src={user.photo} alt={user.name} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} /> : getInitials(user.name)}
          </div>
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className={`user-role ${user.role === 'admin' ? 'admin' : ''}`}>{user.role === 'admin' ? '🛡️ Admin' : 'Member'}</div>
          </div>
        </div>
      ) : (
        <NavLink to="/login" className="sidebar-user" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="user-avatar"><span>?</span></div>
          <div className="user-info">
            <div className="user-name">Sign In</div>
            <div className="user-role">to get started</div>
          </div>
        </NavLink>
      )}
    </aside>
  );
};

export default Sidebar;
