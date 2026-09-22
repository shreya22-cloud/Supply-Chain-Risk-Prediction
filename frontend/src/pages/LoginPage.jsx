import React, { useState } from 'react';
import { Zap, Lock, Mail, ArrowRight, Play, Factory, Anchor, Truck, Building2, UserCheck, UserPlus } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const registeredAccount = JSON.parse(localStorage.getItem('supplyguard-account') || 'null');
  const [mode, setMode] = useState(registeredAccount ? 'signin' : 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(registeredAccount?.email || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (mode === 'register') {
      if (password.length < 6) {
        setError('Use a password with at least 6 characters.');
        return;
      }
      localStorage.setItem('supplyguard-account', JSON.stringify({ name: name.trim(), email, password }));
      setPassword('');
      setMode('signin');
      setError('Registration complete. Sign in to continue.');
      return;
    }

    const account = JSON.parse(localStorage.getItem('supplyguard-account') || 'null');
    if (!account || account.email !== email || account.password !== password) {
      setError('Email or password is incorrect.');
      return;
    }
    onLoginSuccess();
  };

  const handleDemoLogin = () => {
    localStorage.setItem('supplyguard-account', JSON.stringify({
      name: 'Demo Admin',
      email: 'admin@supplyguard.ai',
      password: 'admin123'
    }));
    setEmail('admin@supplyguard.ai');
    setPassword('admin123');
    setMode('signin');
    onLoginSuccess();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f4faf5', color: '#294436' }}>
      
      {/* Left Column: Animated Supply Chain Graphic */}
      <div style={{
        flex: '1.2',
        background: '#ffffff',
        borderRight: '1px solid #d7e8da',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(2, 132, 199, 0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <Zap size={32} style={{ color: '#6a9f7d' }} />
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, background: 'linear-gradient(135deg, #6a9f7d 0%, #86a98d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SUPPLYGUARD AI
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b8172' }}>Intelligent Supply Chain Risk Control Tower</div>
          </div>
        </div>

        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem', color: '#294436' }}>
          Real-Time Neural Intelligence for Global Logistics
        </h2>
        <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, marginBottom: '3rem', maxWidth: '540px' }}>
          Monitor high-risk shipping corridors, simulate graph-based disruption propagation, and deploy automated prescriptive mitigations.
        </p>

        {/* Animated Supply Chain Pipeline Graphic */}
        <div className="glass-panel" style={{ padding: '2rem', position: 'relative', background: '#f4faf5', borderColor: '#d7e8da' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6a9f7d', letterSpacing: '0.05em', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
            Autonomous Network Pipeline Flow
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            
            {/* Connecting Glow Line */}
            <div style={{ position: 'absolute', top: '24px', left: '10%', right: '10%', height: '2px', background: 'linear-gradient(90deg, #5b9b70 0%, #dc2626 50%, #6a9f7d 100%)', zIndex: 1 }} />

            {[
              { label: 'Supplier', icon: Factory, status: 'Healthy', color: '#5b9b70' },
              { label: 'Port', icon: Anchor, status: '82% Congested', color: '#dc2626' },
              { label: 'Transit', icon: Truck, status: 'In Transit', color: '#d97706' },
              { label: 'Warehouse', icon: Building2, status: 'Buffered', color: '#6a9f7d' },
              { label: 'Customer', icon: UserCheck, status: 'On Schedule', color: '#5b9b70' }
            ].map((node, i) => {
              const Icon = node.icon;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    border: `2px solid ${node.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 2px 8px ${node.color}30`
                  }}>
                    <Icon size={20} style={{ color: node.color }} />
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '0.5rem', color: '#294436' }}>{node.label}</div>
                  <div style={{ fontSize: '0.65rem', color: node.color, marginTop: '2px', fontWeight: 600 }}>{node.status}</div>
                </div>
              );
            })}

          </div>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem 5rem'
      }}>
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
          
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', color: '#294436' }}>
            {mode === 'register' ? 'Create your account' : 'Control Tower Sign In'}
          </h2>
          <p style={{ color: '#6b8172', fontSize: '0.875rem', marginBottom: '2rem' }}>
            {mode === 'register'
              ? 'Register to access your intelligent supply chain control tower.'
              : 'Sign in to continue managing your supply chain risks.'}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#456050', marginBottom: '0.4rem' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <UserPlus size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#91a99a' }} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', background: '#ffffff', border: '1px solid #c7dccb', borderRadius: '8px', color: '#294436', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#456050', marginBottom: '0.4rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#91a99a' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem 0.65rem 2.5rem',
                    background: '#ffffff',
                    border: '1px solid #c7dccb',
                    borderRadius: '8px',
                    color: '#294436',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#456050', marginBottom: '0.4rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#91a99a' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem 0.65rem 2.5rem',
                    background: '#ffffff',
                    border: '1px solid #c7dccb',
                    borderRadius: '8px',
                    color: '#294436',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
              {mode === 'signin' ? (
                <>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6b8172', cursor: 'pointer' }}>
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> Remember credentials
                  </label>
                  <span style={{ color: '#6a9f7d' }}>Forgot password?</span>
                </>
              ) : (
                <span style={{ color: '#6b8172' }}>Your account stays on this device.</span>
              )}
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
              {mode === 'register' ? 'Register Account' : 'Sign In to Platform'} <ArrowRight size={18} />
            </button>

            {mode === 'signin' && (
              <button type="button" onClick={handleDemoLogin} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', borderColor: '#6a9f7d', color: '#6a9f7d', background: '#f0f9ff' }}>
                <Play size={16} fill="#6a9f7d" /> Instant Demo Login (admin@supplyguard.ai)
              </button>
            )}

          </form>

          {error && (
            <div role="status" style={{ marginTop: '1rem', padding: '0.7rem', borderRadius: '8px', background: error.includes('complete') ? '#f0fdf4' : '#fef2f2', color: error.includes('complete') ? '#15803d' : '#b91c1c', fontSize: '0.8rem' }}>
              {error}
            </div>
          )}

          <button type="button" onClick={() => { setError(''); setMode(mode === 'register' ? 'signin' : 'register'); }} style={{ marginTop: '1.5rem', width: '100%', border: 'none', background: 'transparent', color: '#6a9f7d', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
            {mode === 'register' ? 'Already registered? Sign in' : 'Need an account? Register'}
          </button>

          <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#91a99a' }}>
            Predict disruptions before they happen.
          </div>

        </div>
      </div>

    </div>
  );
}
