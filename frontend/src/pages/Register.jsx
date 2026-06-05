import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError("Passwords don't match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/edit-profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-shell page-fade">
      {/* LEFT */}
      <div className="auth-left">
        <div className="auth-bg-orb" style={{ background: 'var(--accent3)', width: 500, height: 500, top: '-10%', left: '-15%' }} />
        <div className="auth-bg-orb" style={{ background: 'var(--accent)', width: 300, height: 300, bottom: '0%', right: '10%', animationDelay: '-2s' }} />
        <div className="auth-features">
          <div className="logo-mark" style={{ marginBottom: 40 }}>
            <div className="logo-icon">SB</div>
            <div className="logo-text">Skill<span>Bridge</span></div>
          </div>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 32, fontWeight: 800, letterSpacing: -1, marginBottom: 12 }}>Join 1,200+<br />skill traders today.</h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 40, lineHeight: 1.7 }}>Create your free account, list your skills, and start exchanging knowledge with talented people worldwide.</p>
          {[
            { icon: '⚡', bg: 'rgba(245,158,11,0.1)', title: 'Set Up in 2 Minutes', desc: 'Quick profile setup with guided onboarding.' },
            { icon: '🌍', bg: 'rgba(52,211,153,0.1)', title: 'Global Talent Pool', desc: 'Connect with skill partners from every corner of the world.' },
            { icon: '🔒', bg: 'rgba(108,99,255,0.12)', title: 'Secure & Private', desc: 'Your data is encrypted and never sold to third parties.' },
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

      {/* RIGHT */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-logo">
            <div className="logo-mark">
              <div className="logo-icon">SB</div>
              <div className="logo-text">Skill<span>Bridge</span></div>
            </div>
          </div>
          <div className="auth-heading">Create Account</div>
          <div className="auth-sub">Join Skill Bridge for free — no credit card required</div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: 'var(--danger)', marginBottom: 20 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="input-group">
              <label className="input-label" htmlFor="name">Full Name</label>
              <input id="name" className="input" type="text" placeholder="Alex Johnson" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="email">Email Address</label>
              <input id="email" className="input" type="email" placeholder="alex@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="password">Password</label>
              <input id="password" className="input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="confirm-password">Confirm Password</label>
              <input id="confirm-password" className="input" type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted2)', lineHeight: 1.5 }}>
              By registering, you agree to our <a href="#" style={{ color: 'var(--accent2)' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--accent2)' }}>Privacy Policy</a>.
            </p>
            <button type="submit" className={`btn btn-primary btn-full btn-lg${loading ? ' btn-loading' : ''}`} disabled={loading}>
              {!loading && 'Create Account →'}
            </button>
          </form>

          <div className="auth-divider"><span>Already have an account?</span></div>
          <div className="auth-switch">
            <Link to="/login" className="btn btn-secondary btn-full">Sign In Instead</Link>
          </div>
          <div className="auth-switch" style={{ marginTop: 16 }}>
            <Link to="/" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 13 }}>← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
