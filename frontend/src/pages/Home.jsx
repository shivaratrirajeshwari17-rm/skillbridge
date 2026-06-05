import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    { icon: '🎯', bg: 'rgba(108,99,255,0.12)', title: 'Smart Matching', desc: 'Our algorithm finds users whose offered skills match what you want to learn, and vice versa.' },
    { icon: '🔄', bg: 'rgba(52,211,153,0.1)', title: 'Skill Swapping', desc: 'Trade your expertise for knowledge. No money, no subscriptions — just pure peer-to-peer learning.' },
    { icon: '💬', bg: 'rgba(244,114,182,0.1)', title: 'Real-time Chat', desc: 'Communicate instantly with your matches. Coordinate sessions and build lasting connections.' },
    { icon: '🛡️', bg: 'rgba(245,158,11,0.1)', title: 'Verified Profiles', desc: 'Every user is verified. Trade with confidence, knowing your partner is committed to the exchange.' },
    { icon: '📊', bg: 'rgba(167,139,250,0.1)', title: 'Track Progress', desc: 'Monitor your trades, view history, and see your personal growth over time with detailed analytics.' },
    { icon: '🌍', bg: 'rgba(52,211,153,0.1)', title: 'Global Community', desc: 'Connect with skill-traders from around the world. Language is no barrier to learning.' },
  ];
  const steps = [
    { num: '01', title: 'Create Profile', desc: 'Sign up and list the skills you can teach and want to learn.' },
    { num: '02', title: 'Get Matched', desc: 'Our algorithm instantly shows you compatible skill partners.' },
    { num: '03', title: 'Send Request', desc: 'Propose a trade with a personalized message to your match.' },
    { num: '04', title: 'Start Learning', desc: 'Chat, schedule sessions, and grow your expertise together.' },
  ];

  return (
    <div className="landing-page page-fade" style={{ marginLeft: 0 }}>
      {/* NAV */}
      <nav className="landing-nav">
        <div className="logo-mark">
          <div className="logo-icon">SB</div>
          <div className="logo-text">Skill<span>Bridge</span></div>
        </div>
        <div className="flex gap-12">
          <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="landing-hero">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 720 }}>
          <div className="hero-badge">✨ Peer-to-Peer Skill Exchange Platform</div>
          <h1 className="hero-headline">
            Trade Skills,<br />
            <span className="gradient-text">Not Money.</span>
          </h1>
          <p className="hero-sub">
            Connect with talented people, teach what you know, and learn what you've always wanted — completely free, forever.
          </p>
          <div className="hero-btns">
            <Link to="/register" className="btn btn-primary btn-lg">Start for Free →</Link>
            <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
          </div>
          <div className="hero-stats">
            {[['1.2K+','Active Members'],['500+','Skills Available'],['10K+','Successful Trades'],['98%','Satisfaction Rate']].map(([v,l]) => (
              <div key={l}>
                <div className="hero-stat-value">{v}</div>
                <div className="hero-stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="landing-section">
        <div className="landing-section-title">Everything you need to<br />exchange skills effortlessly</div>
        <div className="landing-section-sub">Built for learners, by learners. Skill Bridge makes it easy to find your perfect learning partner.</div>
        <div className="feature-grid">
          {features.map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-card-icon" style={{ background: f.bg }}>{f.icon}</div>
              <div className="feature-card-title">{f.title}</div>
              <div className="feature-card-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="landing-section" style={{ paddingTop: 0 }}>
        <div className="landing-section-title">How it Works</div>
        <div className="landing-section-sub">Four simple steps to start your skill exchange journey.</div>
        <div className="how-it-works">
          {steps.map(s => (
            <div key={s.num} className="how-step">
              <div className="how-num">{s.num}</div>
              <div className="how-title">{s.title}</div>
              <div className="how-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <h2 className="landing-section-title" style={{ marginBottom: 12 }}>Ready to start trading skills?</h2>
        <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>Join over 1,200 learners already on Skill Bridge. No credit card required.</p>
        <div className="hero-btns" style={{ justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
          <Link to="/matches" className="btn btn-secondary btn-lg">Browse Matches</Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="logo-mark">
          <div className="logo-icon" style={{ width: 28, height: 28, fontSize: 12 }}>SB</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>SkillBridge</span>
        </div>
        <span>© 2025 Skill Bridge. Built with 💜 for learners everywhere.</span>
        <div className="flex gap-16" style={{ fontSize: 13 }}>
          <a href="#" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Terms</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
