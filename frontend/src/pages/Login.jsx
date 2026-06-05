import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-shell page-fade">
      {/* LEFT PANEL */}
      <div className="auth-left">
        <div className="auth-bg-orb" style={{ background: 'var(--accent)', width: 400, height: 400, top: '10%', left: '-10%' }} />
        <div className="auth-bg-orb" style={{ background: 'var(--accent5)', width: 300, height: 300, bottom: '5%', right: '-5%', animationDelay: '-3s' }} />
        <div className="auth-features">
          <div className="logo-mark" style={{ marginBottom: 40 }}>
            <div className="logo-icon">SB</div>
            <div className="logo-text">Skill<span>Bridge</span></div>
          </div>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 32, fontWeight: 800, letterSpacing: -1, marginBottom: 12 }}>Welcome back,<br />skill trader.</h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 40, lineHeight: 1.7 }}>Your learning partners are waiting. Sign in to continue your skill exchange journey.</p>
          {[
            { icon: '🎯', bg: 'rgba(108,99,255,0.12)', title: 'Smart Matching Algorithm', desc: 'Find your perfect skill partner in seconds.' },
            { icon: '🔄', bg: 'rgba(52,211,153,0.1)', title: 'Zero-Cost Learning', desc: 'Trade knowledge, not money. Always free.' },
            { icon: '💬', bg: 'rgba(244,114,182,0.1)', title: 'Real-time Messaging', desc: 'Coordinate skill sessions instantly.' },
          ].map(f => (
            <div key={f.title} className="auth-feature-item">
              <div className="auth-feature-icon" style={{ background: f.bg }}>{f.icon}</div>
              <div>
                <div className="auth-feature-title">{f.title}</div>
                <div className="auth-feature-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-logo">
            <div className="logo-mark">
              <div className="logo-icon">SB</div>
              <div className="logo-text">Skill<span>Bridge</span></div>
            </div>
          </div>
          <div className="auth-heading">Sign In</div>
          <div className="auth-sub">Enter your credentials to access your account</div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: 'var(--danger)', marginBottom: 20 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="input-group">
              <label className="input-label" htmlFor="email">Email Address</label>
              <input id="email" className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="password">Password</label>
              <input id="password" className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" className={`btn btn-primary btn-full btn-lg${loading ? ' btn-loading' : ''}`} disabled={loading}>
              {!loading && 'Sign In →'}
            </button>
          </form>

          <div className="auth-divider"><span>Don't have an account?</span></div>
          <div className="auth-switch">
            <Link to="/register" className="btn btn-secondary btn-full">Create Account</Link>
          </div>
          <div className="auth-switch" style={{ marginTop: 16 }}>
            <Link to="/" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 13 }}>← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
