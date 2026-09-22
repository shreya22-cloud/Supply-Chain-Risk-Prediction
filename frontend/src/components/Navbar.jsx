import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Play } from 'lucide-react';
import { triggerDemoMode } from '../data/api';

export default function Navbar({ onSearch, activePage, setActivePage, onTriggerDemo }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { id: '1', title: 'Critical Risk Alert RSK-9921', desc: 'Port of Hamburg labor disruption escalating (+12.5d delay)', time: '10m ago', type: 'critical' },
    { id: '2', title: 'Port Congestion Spike', desc: 'Shenzhen terminal 4 wait time increased to 74%', time: '1h ago', type: 'warning' },
    { id: '3', title: 'ML Prediction Model Updated', desc: 'Conformal lead-time accuracy updated to 94.2%', time: '3h ago', type: 'info' }
  ];

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearch) onSearch(val);
  };

  const handleDemoClick = async () => {
    await triggerDemoMode();
    if (onTriggerDemo) onTriggerDemo();
    setActivePage('overview');
  };

  return (
    <header style={{
      height: '68px',
      background: '#ffffff',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      borderBottom: '1px solid #d7e8da',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Search Input */}
      <div style={{ position: 'relative', width: '380px' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#91a99a' }} />
        <input
          type="text"
          placeholder="Search PO ID, Supplier, Port, Shipment, Alert, Product..."
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            width: '100%',
            padding: '0.55rem 1rem 0.55rem 2.5rem',
            background: '#f4faf5',
            border: '1px solid #c7dccb',
            borderRadius: '8px',
            color: '#294436',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
        />
      </div>

      {/* Right Navbar Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        
        {/* DEMO MODE TRIGGER BUTTON */}
        <button
          onClick={handleDemoClick}
          className="btn-primary"
          style={{
            background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
            padding: '0.45rem 0.9rem',
            fontSize: '0.825rem',
            boxShadow: '0 2px 10px rgba(225, 29, 72, 0.25)'
          }}
        >
          <Play size={14} fill="#fff" />
          <span>Demo Mode: Hamburg Scenario</span>
        </button>

        {/* System Health Monitor */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.35rem 0.75rem',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '20px',
          fontSize: '0.75rem',
          color: '#5b9b70',
          fontWeight: 600
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#5b9b70', boxShadow: '0 0 8px #5b9b70' }}></span>
          <span>SYSTEM ONLINE</span>
        </div>

        {/* Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              background: '#edf7ef',
              border: '1px solid #c7dccb',
              padding: '0.5rem',
              borderRadius: '8px',
              color: '#456050',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <Bell size={18} />
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '16px',
              height: '16px',
              background: '#dc2626',
              borderRadius: '50%',
              fontSize: '10px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700
            }}>3</span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="glass-panel" style={{
              position: 'absolute',
              right: 0,
              top: '45px',
              width: '320px',
              padding: '1rem',
              zIndex: 50,
              background: '#ffffff',
              border: '1px solid #d7e8da',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid #d7e8da' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#294436' }}>Risk Alerts & Notifications</span>
                <span style={{ fontSize: '0.75rem', color: '#6a9f7d', cursor: 'pointer' }}>Mark all read</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => { setActivePage('alerts'); setShowNotifications(false); }}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '6px',
                      background: '#f4faf5',
                      cursor: 'pointer',
                      borderLeft: n.type === 'critical' ? '3px solid #dc2626' : n.type === 'warning' ? '3px solid #d97706' : '3px solid #6a9f7d'
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#294436' }}>{n.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b8172', marginTop: '2px' }}>{n.desc}</div>
                    <div style={{ fontSize: '0.65rem', color: '#91a99a', marginTop: '4px' }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowProfile(!showProfile)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.4rem 0.75rem',
              background: '#f4faf5',
              border: '1px solid #c7dccb',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6a9f7d 0%, #8aaa91 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>
              CS
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#294436' }}>Chief Supply Officer</div>
              <div style={{ fontSize: '0.7rem', color: '#6b8172' }}>admin@supplyguard.ai</div>
            </div>
            <ChevronDown size={14} style={{ color: '#6b8172' }} />
          </div>

          {showProfile && (
            <div className="glass-panel" style={{
              position: 'absolute',
              right: 0,
              top: '50px',
              width: '200px',
              padding: '0.5rem',
              zIndex: 50,
              background: '#ffffff',
              border: '1px solid #d7e8da',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <div
                onClick={() => { setActivePage('settings'); setShowProfile(false); }}
                style={{ padding: '0.5rem', fontSize: '0.85rem', color: '#456050', cursor: 'pointer', borderRadius: '6px' }}
              >
                Control Settings
              </div>
              <div style={{ borderTop: '1px solid #d7e8da', margin: '0.25rem 0' }}></div>
              <div
                onClick={() => window.location.reload()}
                style={{ padding: '0.5rem', fontSize: '0.85rem', color: '#dc2626', cursor: 'pointer', borderRadius: '6px' }}
              >
                Sign Out
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

